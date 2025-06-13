package com.example.demo.Controllers;

import com.example.demo.Model.EcopontoModel;
import com.example.demo.Model.UsuarioModel;
import com.example.demo.Repositorys.EcopontoRepository;
import com.example.demo.Repositorys.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ecopontos")
@CrossOrigin(origins = "*")
public class EcopontoController {

    private final EcopontoRepository repository;
    private final UsuarioRepository usuarioRepository; // ADICIONAR

    public EcopontoController(EcopontoRepository repository, UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody EcopontoModel ecoponto, @RequestParam String emailUsuario) {
        UsuarioModel user = usuarioRepository.findByEmail(emailUsuario);
        if (user == null || !"ADMIN".equals(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Usuário não autorizado");
        }
        EcopontoModel salvo = repository.save(ecoponto);
        return ResponseEntity.ok(salvo);
    }

    @GetMapping
    public List<EcopontoModel> listarTodos() {
        return repository.findAll();
    }
}

