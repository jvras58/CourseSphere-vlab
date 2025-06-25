export async function signIn(_provider: string, data: { email: string; password: string; redirect: boolean }) {
  console.log('Dados recebidos no signIn:', data);
  
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (data.email === 'erro@email.com') {
    return { error: 'Usuário ou senha inválidos' };
  }
  return { error: null };
}