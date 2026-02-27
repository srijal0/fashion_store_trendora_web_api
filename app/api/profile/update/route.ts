import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    // Parse the FormData from the request
    const formData = await request.formData();
    
    // Extract all the fields
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const bio = formData.get("bio") as string | null;
    const phone = formData.get("phone") as string | null;
    const image = formData.get("image") as File | null;

    // Validate required fields
    if (!userId || !name || !email) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Missing required fields: userId, name, or email" 
        },
        { status: 400 }
      );
    }

    let imageUrl: string | null = null;

    // Handle image upload if a file was provided
    if (image && image.size > 0) {
      try {
        // Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        if (!validTypes.includes(image.type)) {
          return NextResponse.json(
            { 
              success: false, 
              message: "Invalid file type. Only JPG, PNG, GIF, and WebP are allowed." 
            },
            { status: 400 }
          );
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (image.size > maxSize) {
          return NextResponse.json(
            { 
              success: false, 
              message: "File size too large. Maximum size is 5MB." 
            },
            { status: 400 }
          );
        }

        // Convert file to buffer
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadsDir)) {
          await mkdir(uploadsDir, { recursive: true });
        }

        // Generate unique filename
        const fileExtension = image.name.split(".").pop();
        const uniqueFilename = `${userId}-${Date.now()}.${fileExtension}`;
        const filepath = path.join(uploadsDir, uniqueFilename);

        // Save the file to the public/uploads directory
        await writeFile(filepath, buffer);

        // Create the public URL for the image
        imageUrl = `/uploads/${uniqueFilename}`;

        console.log("✅ Image uploaded successfully:", imageUrl);
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return NextResponse.json(
          { 
            success: false, 
            message: "Failed to upload image. Please try again." 
          },
          { status: 500 }
        );
      }
    }

    // Prepare data for database update
    const updateData = {
      name,
      email,
      bio: bio || null,
      phone: phone || null,
      ...(imageUrl && { image: imageUrl }), // Only include image if it was uploaded
    };

    // TODO: Update your database here
    // Example with Prisma:
    // const updatedUser = await prisma.user.update({
    //   where: { id: userId },
    //   data: updateData,
    // });

    // Example with MongoDB:
    // const updatedUser = await User.findByIdAndUpdate(
    //   userId,
    //   { $set: updateData },
    //   { new: true }
    // );

    // For now, just log the data (remove this when you add database integration)
    console.log("📝 Profile update data:", {
      userId,
      ...updateData,
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      imageUrl: imageUrl, // Send back the image URL so frontend can update preview
      data: updateData, // Optional: send back all updated data
    });

  } catch (error) {
    console.error("❌ Profile update error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "An unexpected error occurred. Please try again later." 
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET method to retrieve profile data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // TODO: Fetch user data from database
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    // });

    // For now, return mock data
    return NextResponse.json({
      success: true,
      data: {
        userId,
        name: "John Doe",
        email: "john@example.com",
        bio: null,
        phone: null,
        image: null,
      },
    });

  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}