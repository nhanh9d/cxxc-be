import * as admin from 'firebase-admin';
import serviceAccount from '../../cxxc-94c22-firebase-adminsdk-uf6vp-21626b7d43.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;