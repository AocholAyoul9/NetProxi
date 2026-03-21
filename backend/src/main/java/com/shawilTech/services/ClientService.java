package com.shawilTech.identityservice.service;

import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.entity.*;
import com.shawilTech.identityservice.repository.*;
import com.shawilTech.identityservice.repository.ClientRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    public ClientResponseDto registerClient(ClientRequestDto clientDto) {

        Client client = new Client();
        client.setName(clientDto.getName());
        client.setEmail(clientDto.getEmail());
        client.setPassword(clientDto.getPassword()); // TODO: Hash password before storing
        client.setPhone(clientDto.getPhone());
        client.setAddress(clientDto.getAddress());

        // TODO: Replace with proper signed JWT token as part of auth reimplementation
        String token = UUID.randomUUID().toString();

        client.setToken(token);

        Client savedClient = clientRepository.save(client);

        return mapToResponse(savedClient);
    }

    public ClientResponseDto getClientProfile(UUID clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        return mapToResponse(client);
    }

    public ClientResponseDto loginClient(ClientLoginRequestDto dto) {

        Client client = clientRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // TODO: Use proper password verification (e.g., BCrypt.matches) as part of auth reimplementation
        if (!dto.getPassword().equals(client.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // TODO: Replace with proper signed JWT token as part of auth reimplementation
        String token = UUID.randomUUID().toString();
        client.setToken(token);

        clientRepository.save(client);

        return mapToResponse(client);
    }

    private ClientResponseDto mapToResponse(Client client) {
        return ClientResponseDto.builder()
                .id(client.getId())
                .name(client.getName())
                .email(client.getEmail())
                .phone(client.getPhone())
                .address(client.getAddress())
                .token(client.getToken())
                .build();
    }
}