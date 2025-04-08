
/**
 * Creates a mock Supabase client for development purposes
 * Used when Supabase credentials are not available or initialization fails
 */
export function createMockClient() {
  console.log('Using mock Supabase client - functionality will be limited to local storage');
  
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development';
  
  // Setup localStorage for mock auth if in dev mode
  if (isDev) {
    // Initialize mock users in localStorage if it doesn't exist
    if (!localStorage.getItem('mock_users')) {
      localStorage.setItem('mock_users', JSON.stringify([]));
    }
  }
  
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: (callback) => {
        // Return a subscription object that can be unsubscribed
        return {
          data: { 
            subscription: { 
              unsubscribe: () => {} 
            }
          }
        };
      },
      signInWithPassword: async ({ email, password }) => {
        // Return mock error in production
        if (!isDev) {
          return { 
            data: null, 
            error: { 
              message: 'This is a mock Supabase client. Please configure proper Supabase credentials for authentication.' 
            } 
          };
        }
        
        try {
          // Get mock users from localStorage
          const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
          
          // Find the user
          const user = users.find(u => u.email === email);
          
          // Check if user exists and password matches
          if (!user) {
            return { 
              data: null, 
              error: { message: 'User not found. Please sign up first.' } 
            };
          }
          
          if (user.password !== password) {
            return { 
              data: null, 
              error: { message: 'Incorrect password.' } 
            };
          }
          
          // Create mock session
          const session = {
            user: {
              id: user.id,
              email: user.email
            }
          };
          
          // Store in localStorage as current user
          localStorage.setItem('mock_current_user', JSON.stringify(session.user));
          
          return { data: { user: session.user, session }, error: null };
        } catch (err) {
          return { 
            data: null, 
            error: { message: 'Mock auth error: ' + (err instanceof Error ? err.message : String(err)) } 
          };
        }
      },
      signUp: async ({ email, password }) => {
        // Return mock error in production
        if (!isDev) {
          return { 
            data: null, 
            error: { 
              message: 'This is a mock Supabase client. Please configure proper Supabase credentials for authentication.' 
            } 
          };
        }
        
        try {
          // Get mock users from localStorage
          const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
          
          // Check if email already exists
          if (users.some(u => u.email === email)) {
            return { 
              data: null, 
              error: { message: 'User with this email already exists.' } 
            };
          }
          
          // Create a new user
          const newUser = {
            id: `user-${Date.now()}`,
            email,
            password // In a real app, we'd hash this!
          };
          
          // Add to mock users and save
          users.push(newUser);
          localStorage.setItem('mock_users', JSON.stringify(users));
          
          // Return successful signup
          return { 
            data: { 
              user: { id: newUser.id, email: newUser.email },
              // In dev mode, auto-confirm the user
              session: { 
                user: { id: newUser.id, email: newUser.email } 
              }
            }, 
            error: null 
          };
        } catch (err) {
          return { 
            data: null, 
            error: { message: 'Mock auth error: ' + (err instanceof Error ? err.message : String(err)) } 
          };
        }
      },
      signOut: async () => {
        // Clear mock current user
        localStorage.removeItem('mock_current_user');
        return { error: null };
      }
    },
    from: (table) => ({
      select: (columns) => ({
        order: (column, { ascending }) => Promise.resolve({
          data: [],
          error: null
        }),
        eq: (column, value) => ({
          single: () => Promise.resolve({
            data: null,
            error: null
          }),
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      upsert: (data) => ({
        select: () => ({
          single: () => Promise.resolve({
            data: null,
            error: null
          })
        })
      }),
      delete: () => ({
        eq: () => Promise.resolve({
          error: null
        })
      })
    })
  };
}
