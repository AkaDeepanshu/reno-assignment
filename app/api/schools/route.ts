import { NextRequest, NextResponse } from 'next/server';
import { getConnection, ensureSchoolsTable } from '@/lib/db';
import { schoolSchema } from '@/lib/validation';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    // Ensure table exists before any operation
    await ensureSchoolsTable();
    const formData = await request.formData();
    
    const schoolData = {
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      contact: formData.get('contact') as string,
      email_id: formData.get('email_id') as string,
    };

    // Validate the data (without image for now)
    const validatedData = schoolSchema.parse(schoolData);
    
    const connection = await getConnection();
    
    let imagePath = null;
    
    // Handle image upload
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile instanceof File && imageFile.size > 0 && imageFile.name !== 'undefined') {
      console.log('Processing image:', imageFile.name, 'Size:', imageFile.size);
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const filename = `school_${Date.now()}_${imageFile.name}`;
        const filepath = join(process.cwd(), 'public', 'schoolImages', filename);
        
        await writeFile(filepath, buffer);
        imagePath = `/schoolImages/${filename}`;
        console.log('Image saved to:', imagePath);
      } catch (imageError) {
        console.error('Error saving image:', imageError);
        // Continue without image if there's an error
        imagePath = null;
      }
    } else {
      console.log('No valid image file received');
    }
    
    // Insert into database
    const insertQuery = `
      INSERT INTO schools (name, address, city, state, contact, image, email_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const insertValues = [
      validatedData.name,
      validatedData.address,
      validatedData.city,
      validatedData.state,
      parseInt(validatedData.contact),
      imagePath,
      validatedData.email_id
    ];
    
    console.log('Inserting school with values:', insertValues);
    
    const [result] = await connection.execute(insertQuery, insertValues);
    
    await connection.end();
    
    console.log('School inserted successfully with ID:', (result as any).insertId);
    
    return NextResponse.json({
      success: true,
      message: 'School added successfully',
      id: (result as any).insertId
    });
    
  } catch (error: any) {
    console.error('Error adding school:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to add school'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Ensure table exists before any operation
    await ensureSchoolsTable();
    
    const connection = await getConnection();
    
    const [rows] = await connection.execute(
      'SELECT id, name, address, city, state, contact, image, email_id FROM schools ORDER BY created_at DESC'
    );
    
    await connection.end();
    
    console.log('Fetched schools from database:', rows);
    
    return NextResponse.json({
      success: true,
      schools: rows
    });
    
  } catch (error) {
    console.error('Error fetching schools:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch schools'
    }, { status: 500 });
  }
}
