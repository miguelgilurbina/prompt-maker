import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUser(email: string) {
  try {
    console.log(`Checking for user with email: ${email}`);
    
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        hashedPassword: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      return null;
    }

    const userInfo = {
      id: user.id,
      email: user.email,
      name: user.name,
      hasPassword: !!user.hashedPassword,
      passwordLength: user.hashedPassword?.length || 0,
      emailVerified: user.emailVerified,
      image: user.image,
      createdAt: (user as any).createdAt || 'Not available',
      updatedAt: (user as any).updatedAt || 'Not available'
    };

    console.log('✅ User found:');
    console.log(JSON.stringify(userInfo, null, 2));
    
    return userInfo;
  } catch (error) {
    console.error('❌ Error checking user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Check the test user
async function main() {
  try {
    const user = await checkUser('test@example.com');
    
    if (user) {
      console.log('\nVerification:');
      if (user.hasPassword) {
        console.log('✅ User has a password hash');
      } else {
        console.log('⚠️  User exists but has no password set');
      }
      
      if (user.emailVerified) {
        console.log(`✅ Email verified on: ${user.emailVerified}`);
      } else {
        console.log('⚠️  Email not verified');
      }
    }
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

main();
