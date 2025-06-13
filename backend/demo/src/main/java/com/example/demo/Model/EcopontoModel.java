package com.example.demo.Model;

import jakarta.persistence.*;

@Entity
public class EcopontoModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String descricao;
    private Double latitude;
    private Double longitude;
    private String tipoResiduos;

    public EcopontoModel() {
    }

    public EcopontoModel(String nome, String descricao, Double latitude, Double longitude, String tipoResiduos) {
        this.nome = nome;
        this.descricao = descricao;
        this.latitude = latitude;
        this.longitude = longitude;
        this.tipoResiduos = tipoResiduos;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getTipoResiduos() { return tipoResiduos; }
    public void setTipoResiduos(String tipoResiduos) { this.tipoResiduos = tipoResiduos; }
}
