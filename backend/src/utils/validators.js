/**
 * Verifica se um CNPJ é válido.
 */
function isValidCNPJ(cnpj) {
  if (!cnpj) return false;
  const onlyNumbers = cnpj.replace(/[^\d]/g, '');
  if (onlyNumbers.length !== 14 || /^(\d)\1+$/.test(onlyNumbers)) return false;
  return true;
}

/**
 * Formata um CNPJ com a máscara padrão.
 */
function formatCNPJ(cnpj) {
  if (!cnpj) return cnpj;
  const onlyNumbers = String(cnpj).replace(/[^\d]/g, '');
  if (onlyNumbers.length === 14) {
    return onlyNumbers.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  }
  return cnpj;
}

/**
 * Verifica se um email é válido.
 */
function isValidEmail(email) {
  if (!email) return false;
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Verifica se um telefone é válido (simplificado).
 */
function isValidPhone(phone) {
    if (!phone) return false;
    const onlyNumbers = String(phone).replace(/[^\d]/g, '');
    return onlyNumbers.length === 10 || onlyNumbers.length === 11;
}

/**
 * Formata um telefone com a máscara padrão.
 */
function formatPhone(phone) {
    if (!phone) return phone;
    const onlyNumbers = String(phone).replace(/[^\d]/g, '');
    if (onlyNumbers.length === 11) {
        return onlyNumbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    if (onlyNumbers.length === 10) {
        return onlyNumbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return phone;
}

/**
 * Verifica se uma string ou objeto de data é uma data válida.
 */
function isValidDate(date) {
  // `new Date(date)` funciona para strings como "2023-12-25" e objetos Date
  return date && !isNaN(new Date(date).getTime());
}


/**
 * Formata uma data para o padrão DD/MM/YYYY, corrigindo o problema de fuso horário.
 */
function formatDate(date) {
  try {
    if (!isValidDate(date)) return date;

    const d = new Date(date);
    
    // Ajusta a data para neutralizar o fuso horário
    const adjustedDate = new Date(d.valueOf() + d.getTimezoneOffset() * 60 * 1000);

    const day = String(adjustedDate.getDate()).padStart(2, '0');
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
    const year = adjustedDate.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return date;
  }
}

// Exporta todas as funções usando a sintaxe module.exports
module.exports = {
  isValidCNPJ,
  formatCNPJ,
  isValidEmail,
  isValidPhone,
  formatPhone,
  isValidDate,
  formatDate,
};