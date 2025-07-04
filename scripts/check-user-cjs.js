const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Successfully connected to the database');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    return false;
  }
}

async function listAllUsers() {
  try {
    console.log('📋 Listing all users in the database:');
    // First, check if the User table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'User'
      );
    `;
    
    if (!tableExists[0].exists) {
      console.log('❌ User table does not exist in the database');
      return [];
    }

    // Get all users with basic fields
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        hashedPassword: true,
        emailVerified: true,
        image: true
      }
    });
    
    console.log(`✅ Found ${users.length} users in the database`);
    if (users.length > 0) {
      console.log(JSON.stringify(users, null, 2));
    }
    return users;
  } catch (error) {
    console.error('❌ Error listing users:', error);
    throw error;
  }
}

async function checkUser(email) {
  try {
    console.log(`🔍 Checking for user with email: ${email}`);
    
    // First, list all users to debug
    await listAllUsers();
    
    // Using Prisma client to find specific user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        hashedPassword: true,
        emailVerified: true,
        image: true
      }
    });

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
    console.log('🔍 Starting database check...');
    
    // 1. Check database connection
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('❌ Cannot proceed without database connection');
      process.exit(1);
    }
    
    // 2. List all users
    const users = await listAllUsers();
    
    if (users.length === 0) {
      console.log('\n❌ No users found in the database');
      console.log('\n💡 Try running the seed script with:');
      console.log('   npx prisma db seed');
      process.exit(1);
    }
    
    // 3. Show existing user details
    const existingUser = users[0]; // Get the first user
    console.log('\n🔍 Found existing user in database:');
    console.log(JSON.stringify(existingUser, null, 2));
    
    console.log('\n🔑 Authentication Info:');
    if (existingUser.hashedPassword) {
      console.log(`✅ Has password hash (${existingUser.hashedPassword.length} characters)`);
      console.log(`   Hash starts with: ${existingUser.hashedPassword.substring(0, 10)}...`);
      console.log('   Hash type: bcrypt (starts with $2b$)')
    } else {
      console.log('❌ No password hash found for user');
    }
    
    if (existingUser.emailVerified) {
      console.log(`✅ Email verified on: ${existingUser.emailVerified}`);
    } else {
      console.log('⚠️  Email not verified - some features may be limited');
    }
    
    console.log('\n🔐 You can use these credentials to log in:');
    console.log(`   Email: ${existingUser.email}`);
    console.log('   Password: [the password you set for this user]');
    
    if (!existingUser.emailVerified) {
      console.log('\n⚠️  Note: The email is not verified. You may need to:');
      console.log('   1. Check your email for a verification link, or');
      console.log('   2. Update the user in the database to set emailVerified to the current date');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
