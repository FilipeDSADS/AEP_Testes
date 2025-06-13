package com.example.demo.Model;

import jakarta.persistence.*;

@Entity
public class UsuarioModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String email;

    private String role;

    public UsuarioModel() {}

    public UsuarioModel(String nome, String email, String role) {
        this.nome = nome;
        this.email = email;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() {return role;}

    public void setRole(String role) {this.role = role;}
}
