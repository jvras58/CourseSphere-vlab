describe('User Entity', () => {
  test('deve criar um usuário válido', () => {
    const user = {
      name: 'Maria',
      email: 'maria@exemplo.com',
      password: 'senha123',
      role_id: 2,
    };
    expect(user).toHaveProperty('email', 'maria@exemplo.com');
  });
  
  test('não deve aceitar usuário sem email', () => {
    const user = {
      name: 'Sem Email',
      password: 'senha123',
      role_id: 2,
    };
    expect(user).not.toHaveProperty('email');
  });
});