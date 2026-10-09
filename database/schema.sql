CREATE TABLE IF NOT EXISTS Formulario (
    id_formulario INT NOT NULL AUTO_INCREMENT,
    name_user VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL,
    password VARCHAR(60) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_formulario),
    UNIQUE KEY uq_formulario_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Usuarios (
    id_usuario INT NOT NULL AUTO_INCREMENT,
    formulario_id INT NOT NULL,
    name VARCHAR(120) NOT NULL,
    email_user VARCHAR(190) NOT NULL,
    portafolios INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_usuarios_formulario (formulario_id),
    CONSTRAINT fk_usuarios_formulario
        FOREIGN KEY (formulario_id) REFERENCES Formulario (id_formulario)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Portafolios (
    id_portafolio INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    Proyectos JSON NOT NULL,
    Titulos VARCHAR(180) NOT NULL,
    Descripciones TEXT NOT NULL,
    Theme VARCHAR(60) NOT NULL DEFAULT 'nivel-ingeniero',
    Data_JSON JSON NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_portafolio),
    KEY ix_portafolios_usuario_actualizado (usuario_id, updated_at),
    CONSTRAINT fk_portafolios_usuario
        FOREIGN KEY (usuario_id) REFERENCES Usuarios (id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Plantillas (
    id_plantilla INT NOT NULL AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(500) NOT NULL DEFAULT '',
    prompt TEXT NOT NULL,
    colores JSON NOT NULL,
    html_template MEDIUMTEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_plantilla),
    KEY ix_plantillas_usuario_actualizado (usuario_id, updated_at),
    CONSTRAINT fk_plantillas_usuario
        FOREIGN KEY (usuario_id) REFERENCES Usuarios (id_usuario)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE Plantillas
    MODIFY COLUMN html_template MEDIUMTEXT NOT NULL;
