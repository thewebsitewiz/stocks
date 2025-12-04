import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  // Set up event listeners before connecting
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('Mongoose reconnected to MongoDB');
  });

  try {
    await mongoose.connect(process.env.MONGODB_URI as string, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Closing MongoDB connection...`);
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

class Database {
  private static instance: Database | null = null;
  private connection: typeof mongoose | null = null;
  private uri: string;

  private constructor() {
    this.uri = process.env.MONGODB_URI || '';
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<typeof mongoose> {
    if (this.connection) {
      console.log('Using existing database connection');
      return this.connection;
    }

    // Set up event listeners before connecting
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('Mongoose reconnected to MongoDB');
    });

    try {
      const conn = await mongoose.connect(this.uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.connection = conn;

      console.log(`MongoDB Connected: ${conn.connection.host}`);

      // Connection event listeners - set up RIGHT AFTER connection
      mongoose.connection.on('connected', () => {
        console.log('Mongoose connected to MongoDB');
      });

      mongoose.connection.on('error', (err) => {
        console.error('Mongoose connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('Mongoose disconnected');
      });

      return this.connection;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
  }

  // Graceful shutdown
  public gracefulShutdown = async (signal: string) => {
    console.log(`\n${signal} received. Closing MongoDB connection...`);
    try {
      // await mongoose.disconnect();
      await mongoose.connection.close();
      this.connection = null;
      console.log('MongoDB connection closed');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  public getConnection(): typeof mongoose | null {
    return this.connection;
  }

  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}

// Graceful shutdown handlers - module level
process.on('SIGINT', async () => {
  // await mongoose.disconnect();
  await mongoose.connection.close();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  // await mongoose.disconnect();
  await mongoose.connection.close();
  console.log('Mongoose connection closed through app termination');
  process.exit(0);
});
