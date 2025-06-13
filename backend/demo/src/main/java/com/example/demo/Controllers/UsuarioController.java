package com.example.demo.Controllers;

import com.example.demo.Model.UsuarioModel;
import com.example.demo.Repositorys.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioRepository repository;

    public UsuarioController(UsuarioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<UsuarioModel> listarUsuarios() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> cadastrarUsuario(@RequestBody UsuarioModel usuario) {
        if (repository.findByEmail(usuario.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email já cadastrado");
        }
        if (usuario.getRole() == null) {
            usuario.setRole("USER");
        }
        UsuarioModel salvo = repository.save(usuario);
        return ResponseEntity.ok(salvo);
    }


    @PostMapping("/login")
    public ResponseEntity<UsuarioModel> login(@RequestBody UsuarioModel loginRequest) {
        Optional<UsuarioModel> usuario = repository.findAll().stream()
                .filter(u -> u.getEmail().equalsIgnoreCase(loginRequest.getEmail()))
                .findFirst();

        return usuario
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }


}
