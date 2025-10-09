package com.shawilTech.identityservice.service;

import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.entity.*;
import com.shawilTech.identityservice.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;
@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;

    public ClientResponseDto createClient(ClientRequestDto clientDto) {
        // Convert DTO to Entity
        Client client = new Client();
        client.setName(clientDto.getName());
        client.setEmail(clientDto.getEmail());
        client.setPhone(clientDto.getPhone());
        client.setAddress(clientDto.getAddress());

        // Save the entity
        Client savedClient = clientRepository.save(client);

        // Convert Entity back to Response DTO
        return mapToClientResponseDto(savedClient);
    }

    public ClientResponseDto getClientById(UUID clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + clientId));

        return mapToClientResponseDto(client);
    }

    public ClientResponseDto updateClient(UUID clientId, ClientRequestDto clientDto) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found with ID: " + clientId));

        client.setName(clientDto.getName());
        client.setEmail(clientDto.getEmail());
        client.setPhone(clientDto.getPhone());
        client.setAddress(clientDto.getAddress());

        Client updatedClient = clientRepository.save(client);
        return mapToClientResponseDto(updatedClient);
    }

    public void deleteClient(UUID clientId) {
        if (!clientRepository.existsById(clientId)) {
            throw new RuntimeException("Client not found with ID: " + clientId);
        }
        clientRepository.deleteById(clientId);
    }

    private ClientResponseDto mapToClientResponseDto(Client client) {
        return ClientResponseDto.builder()
                .id(client.getId())
                .name(client.getName())
                .email(client.getEmail())
                .phone(client.getPhone())
                .address(client.getAddress())
                .build();
    }
}