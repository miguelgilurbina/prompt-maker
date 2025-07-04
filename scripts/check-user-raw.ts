import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function checkUser(email: string) {
  try {
    console.log(`🔍 Checking for user with email: ${email}`);
    
    // Using raw query to bypass TypeScript type issues
    const users = await prisma.$queryRaw`
      SELECT id, email, name, "hashedPassword", 
             "emailVerified", image, "createdAt", "updatedAt"
      FROM "User"
      WHERE email = ${email}
      LIMIT 1
    `;

    const user = Array.isArray(users) ? users[0] : null;

    if (!user) {
      console.log('❌ User not found');
      return null;
    }

    console.log('✅ User found in database:');
    console.log({
      id: user.id,
      email: user.email,
      name: user.name,
      hashedPassword: user.hashedPassword 
        ? `[HASHED, ${user.hashedPassword.length} chars]` 
        : 'NULL',
      emailVerified: user.emailVerified || 'Not verified',
      image: user.image || 'No image',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });

    return user;
  } catch (error) {
    console.error('❌ Error checking user:', error);
    throw error;
  }
}

async function main() {
  try {
    const user = await checkUser('test@example.com');
    
    if (user) {
      console.log('\n🔑 Authentication Info:');
      console.log(`- Has password: ${user.hashedPassword ? '✅ Yes' : '❌ No'}`);
      console.log(`- Email verified: ${user.emailVerified ? '✅ ' + user.emailVerified : '❌ No'}`);
      
      if (user.hashedPassword) {
        console.log('\n🔍 Password hash details:');
        console.log(`- Length: ${user.hashedPassword.length} characters`);
        console.log(`- Looks like bcrypt: ${user.hashedPassword.startsWith('$2a$') ? '✅ Yes' : '❌ No'}`);
      }
    }
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
