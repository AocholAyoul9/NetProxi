package com.shawilTech.identityservice.controller;

import com.shawilTech.identityservice.dto.ClientRequestDto;
import com.shawilTech.identityservice.dto.ClientResponseDto;
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

    @PostMapping
    public ResponseEntity<ClientResponseDto> createClient(@RequestBody ClientRequestDto clientRequest) {
        ClientResponseDto response = clientService.createClient(clientRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<ClientResponseDto> getClient(@PathVariable UUID clientId) {
        ClientResponseDto client = clientService.getClientById(clientId);
        return ResponseEntity.ok(client);
    }

    @PutMapping("/{clientId}")
    public ResponseEntity<ClientResponseDto> updateClient(
            @PathVariable UUID clientId,
            @RequestBody ClientRequestDto clientRequest) {
        ClientResponseDto updatedClient = clientService.updateClient(clientId, clientRequest);
        return ResponseEntity.ok(updatedClient);
    }

    @DeleteMapping("/{clientId}")
    public ResponseEntity<Void> deleteClient(@PathVariable UUID clientId) {
        clientService.deleteClient(clientId);
        return ResponseEntity.noContent().build();
    }
}