
import { AppProvider } from '@toolpad/core/AppProvider';
import { SignInPage } from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';

// Authentication providers
const providers = [{ id: 'credentials', name: 'Email and Password' }];

// Sign-in function
const signIn = async (provider, formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      alert(
        `Signing in with "${provider.name}" and credentials: ${formData.get('email')}, ${formData.get('password')}`
      );
      resolve();
    }, 300);
  });
};

export default function BasicSignInPage() {
  const theme = useTheme();

  return (
    <AppProvider theme={theme}>
      <SignInPage signIn={signIn} providers={providers} />
    </AppProvider>
  );
}
