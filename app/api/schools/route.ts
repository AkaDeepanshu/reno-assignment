import { NextRequest, NextResponse } from 'next/server';
import { getConnection, ensureSchoolsTable } from '@/lib/db';
import { schoolSchema } from '@/lib/validation';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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
    const imageFile = formData.get('image');
    console.log('Image file received:', imageFile);
    console.log('Image file type:', imageFile ? typeof imageFile : 'undefined');
    console.log('Is File instance:', imageFile instanceof File);
    console.log('Form data keys:', [...formData.keys()].join(', '));
    
    // Check if image file exists and is valid
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      console.log('Processing image:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type);
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create schoolImages directory if it doesn't exist
        const schoolImagesDir = join(process.cwd(), 'public', 'schoolImages');
        if (!existsSync(schoolImagesDir)) {
          await mkdir(schoolImagesDir, { recursive: true });
          console.log('Created schoolImages directory');
        }
        
        // Generate unique filename with sanitized school name
        const schoolName = formData.get('name') as string;
        const sanitizedName = schoolName.replace(/[^a-zA-Z0-9]/g, '_');
        
        // Get file extension from mimetype or fallback to jpeg
        let extension = 'jpeg';
        if (imageFile.type) {
          const match = imageFile.type.match(/image\/(\w+)/);
          if (match && match[1]) {
            extension = match[1] === 'jpeg' ? 'jpeg' : (match[1] === 'jpg' ? 'jpeg' : match[1]);
          }
        }
        
        const filename = `school_${Date.now()}_${sanitizedName}_image1_${Math.floor(Math.random() * 10000)}.${extension}`;
        const filepath = join(schoolImagesDir, filename);
        
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
    
    // Log detailed information about images
    console.log('Fetched schools from database:');
    (rows as any[]).forEach(school => {
      console.log(`School ID: ${school.id}, Name: ${school.name}, Image path: ${school.image || 'null'}`);
    });
    
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
