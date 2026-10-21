CREATE TABLE IF NOT EXISTS Formulario (
  id_formulario BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name_user VARCHAR(80) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL COMMENT 'Hash bcrypt; nunca contraseña en texto plano',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_formulario_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Usuarios (
  id_usuario BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  formulario_id BIGINT UNSIGNED NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  email_user VARCHAR(190) NOT NULL UNIQUE,
  portafolios INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Cantidad de portafolios del usuario',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_formulario
    FOREIGN KEY (formulario_id) REFERENCES Formulario(id_formulario)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_usuarios_email (email_user)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS Portafolios (
  id_portafolio BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id BIGINT UNSIGNED NOT NULL,
  Proyectos JSON NOT NULL,
  Titulos VARCHAR(180) NOT NULL,
  Descripciones TEXT NULL,
  Theme VARCHAR(60) NOT NULL DEFAULT 'glow-dark',
  Data_JSON JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_portafolios_usuario
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(id_usuario)
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_portafolios_usuario (usuario_id),
  INDEX idx_portafolios_updated (updated_at)
) ENGINE=InnoDB;

CREATE TRIGGER trg_portafolio_insert
AFTER INSERT ON Portafolios
FOR EACH ROW
BEGIN
  UPDATE Usuarios
  SET portafolios = portafolios + 1
  WHERE id_usuario = NEW.usuario_id;
END;

CREATE TRIGGER trg_portafolio_delete
AFTER DELETE ON Portafolios
FOR EACH ROW
BEGIN
  UPDATE Usuarios
  SET portafolios = IF(portafolios > 0, portafolios - 1, 0)
  WHERE id_usuario = OLD.usuario_id;
END;

select * from Formulario;