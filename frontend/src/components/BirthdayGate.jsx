import { Navigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import { shouldShowBirthdayExperience } from '../utils/birthdayExperience';

/**
 * Wraps the /home element.
 * When a birthday experience is pending for the logged-in user (and not yet
 * completed), it redirects to /amna-birthday before showing Home.
 */
export default function BirthdayGate({ children }) {
  const user = getUser();
  if (user && shouldShowBirthdayExperience(user)) {
    return <Navigate to="/amna-birthday" replace />;
  }
  return children;
}
