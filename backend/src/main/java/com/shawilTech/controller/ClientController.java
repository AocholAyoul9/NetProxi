package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping("/register")
    public ResponseEntity<ClientResponseDto> registerClient(@RequestBody ClientRequestDto clientRequest) {
        ClientResponseDto response = clientService.registerClient(clientRequest);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
    public ResponseEntity<ClientResponseDto> loginClient(@RequestBody ClientLoginRequestDto clientRequest) {
        ClientResponseDto response = clientService.loginClient(clientRequest);
        return ResponseEntity.ok(response);
    }

}