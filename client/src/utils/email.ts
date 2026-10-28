export function isEmailValid(email: string): boolean {
  if (!email) {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return emailRegex.test(email.trim());
}

export function getEmailValidationMessage(email: string): string {
  if (!email) {
    return "Email é obrigatório";
  }

  if (!isEmailValid(email)) {
    return "Email inválido";
  }

  return "";
}

