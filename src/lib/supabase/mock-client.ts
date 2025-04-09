/**
 * Creates a mock Supabase client for development purposes
 * Used when Supabase credentials are not available or initialization fails
 */
export function createMockClient(devFriendlyMode = false) {
  console.log('Using mock Supabase client - functionality will be limited to local storage');
  
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === 'development' || devFriendlyMode;
  
  // Setup localStorage for mock auth if in dev mode
  if (isDev) {
    // Initialize mock users in localStorage if it doesn't exist
    if (!localStorage.getItem('mock_users')) {
      localStorage.setItem('mock_users', JSON.stringify([
        // Add some test users for convenience in development
        {
          id: 'mock-user-1',
          email: 'test@example.com',
          password: 'password'
        }
      ]));
    }
  }
  
  return {
    auth: {
      getSession: () => {
        // Try to get current mock user
        const mockUser = localStorage.getItem('mock_current_user');
        if (mockUser) {
          try {
            const parsedUser = JSON.parse(mockUser);
            return Promise.resolve({ 
              data: { 
                session: { 
                  user: parsedUser 
                } 
              }, 
              error: null 
            });
          } catch (e) {
            console.error('Error parsing mock user:', e);
          }
        }
        
        return Promise.resolve({ data: { session: null }, error: null });
      },
      getUser: () => {
        // Try to get current mock user
        const mockUser = localStorage.getItem('mock_current_user');
        if (mockUser) {
          try {
            const parsedUser = JSON.parse(mockUser);
            return Promise.resolve({ data: { user: parsedUser }, error: null });
          } catch (e) {
            console.error('Error parsing mock user:', e);
          }
        }
        
        return Promise.resolve({ data: { user: null }, error: null });
      },
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
        // In development mode, provide helpful message but allow sign in
        if (isDev) {
          try {
            // Get mock users from localStorage
            const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
            
            // Find the user
            const user = users.find(u => u.email === email);
            
            // Check if user exists and password matches
            if (!user) {
              return { 
                data: null, 
                error: { message: 'User not found. Please sign up first or use test@example.com with password: password' } 
              };
            }
            
            if (user.password !== password) {
              return { 
                data: null, 
                error: { message: 'Incorrect password. Try "password" for test accounts.' } 
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
        }
        
        // In production, show clear error
        return { 
          data: null, 
          error: { 
            message: 'This is a development environment using mock authentication. Use test@example.com with password: password, or configure Supabase credentials for production use.' 
          } 
        };
      },
      signUp: async ({ email, password }) => {
        if (isDev) {
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
            
            // Create session
            const session = { 
              user: { id: newUser.id, email: newUser.email } 
            };
            
            // Auto-confirm in dev mode
            localStorage.setItem('mock_current_user', JSON.stringify(session.user));
            
            // Return successful signup
            return { 
              data: { 
                user: { id: newUser.id, email: newUser.email },
                session
              }, 
              error: null 
            };
          } catch (err) {
            return { 
              data: null, 
              error: { message: 'Mock auth error: ' + (err instanceof Error ? err.message : String(err)) } 
            };
          }
        }
        
        // In production, show clear error
        return { 
          data: null, 
          error: { 
            message: 'This is a development environment using mock authentication. Configure Supabase credentials for production use.' 
          } 
        };
      },
      signOut: async () => {
        // Clear mock current user
        localStorage.removeItem('mock_current_user');
        return { error: null };
      },
      signInWithOAuth: async ({ provider, options }) => {
        if (isDev) {
          // Create mock OAuth user
          const mockUser = {
            id: `mock-${provider}-${Date.now()}`,
            email: `${provider}-user@example.com`,
            provider
          };
          
          // Save mock user
          localStorage.setItem('mock_current_user', JSON.stringify(mockUser));
          
          return { 
            data: { 
              provider,
              url: window.location.origin + '/auth'
            }, 
            error: null 
          };
        }
        
        return {
          data: null,
          error: { 
            message: 'Social login is not available in mock mode. Configure Supabase credentials for production use.' 
          }
        };
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
