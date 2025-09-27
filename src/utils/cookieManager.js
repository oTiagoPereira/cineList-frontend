class CookieManager {
  /**
   * Define um cookie
   * @param {string} name - Nome do cookie
   * @param {string} value - Valor do cookie
   * @param {Object} options - Opções do cookie
   */
  static set(name, value, options = {}) {
    const defaults = {
      path: '/',
      secure: import.meta.env.PROD,
      sameSite: 'Strict',
      httpOnly: false,
      maxAge: 24 * 60 * 60 
    };

    const config = { ...defaults, ...options };

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (config.maxAge) {
      const expires = new Date(Date.now() + (config.maxAge * 1000));
      cookieString += `; expires=${expires.toUTCString()}`;
    }

    if (config.path) {
      cookieString += `; path=${config.path}`;
    }

    if (config.domain) {
      cookieString += `; domain=${config.domain}`;
    }

    if (config.secure) {
      cookieString += `; secure`;
    }

    if (config.sameSite) {
      cookieString += `; samesite=${config.sameSite}`;
    }

    document.cookie = cookieString;
  }

  /**
   * Obtém o valor de um cookie
   * @param {string} name - Nome do cookie
   * @returns {string|null} - Valor do cookie ou null se não existir
   */
  static get(name) {
    const nameEQ = `${encodeURIComponent(name)}=`;
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    return null;
  }

  /**
   * Remove um cookie
   * @param {string} name - Nome do cookie
   * @param {Object} options - Opções do cookie (path, domain)
   */
  static remove(name, options = {}) {
    const config = {
      path: '/',
      ...options,
      maxAge: -1 // Expira imediatamente
    };

    this.set(name, '', config);
  }

  /**
   * Verifica se um cookie existe
   * @param {string} name - Nome do cookie
   * @returns {boolean} - True se o cookie existir
   */
  static exists(name) {
    return this.get(name) !== null;
  }

  /**
   * Obtém todos os cookies
   * @returns {Object} - Objeto com todos os cookies
   */
  static getAll() {
    const cookies = {};
    const cookieArray = document.cookie.split(';');

    for (let cookie of cookieArray) {
      const [name, ...rest] = cookie.split('=');
      if (name && rest.length > 0) {
        cookies[decodeURIComponent(name.trim())] = decodeURIComponent(rest.join('='));
      }
    }

    return cookies;
  }

  /**
   * Remove todos os cookies do domínio atual
   */
  static clear() {
    const cookies = this.getAll();
    for (let name in cookies) {
      this.remove(name);
    }
  }
}

export default CookieManager;
