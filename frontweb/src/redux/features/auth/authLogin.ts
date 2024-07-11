// import { AppDispatch } from '../../store';
// import { login } from './authSlice';
// import { checkUserExistence, createUser } from '../../../websocket/userWebSocket';
// import { getAllPosts } from '../../../websocket/postWebSocket';

// export const performLogin = (email: string, password: string) => async (dispatch: AppDispatch) => {
//   console.log('performLogin called with:', email, password);
//   try {
//     const resultAction = await dispatch(login({ email, password }));
//     if (login.fulfilled.match(resultAction)) {
//       const user = resultAction.payload.user;
//       console.log('Checking if user exists:', user.email);

//       const userExists = await checkUserExistence(user.email);
//       console.log('User exists:', userExists);

//       if (!userExists) {
//         const userId = await createUser({
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName
//         });
//         console.log('User created with ID:', userId);
//       }

//       try {
//         const posts = await getAllPosts();
//         console.log('Posts retrieved:', posts);
//       } catch (error) {
//         console.error('Error retrieving posts:', error);
//       }
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//   }
// };
