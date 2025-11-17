package com.shawilTech.identityservice.service;
import com.shawilTech.identityservice.dto.ClientRequestDto;
import com.shawilTech.identityservice.dto.*;
import com.shawilTech.identityservice.entity.*;
import com.shawilTech.identityservice.repository.*;
import com.shawilTech.identityservice.repository.ClientRepository;
import com.shawilTech.identityservice.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

//import org.springframework.boot.autoconfigure.security.oauth2.server.servlet.OAuth2AuthorizationServerProperties.Client;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtProvider;

    public ClientResponseDto registerClient(ClientRequestDto clientDto) {


        Client client = new Client();
        client.setName(clientDto.getName());
        client.setEmail(clientDto.getEmail());
        client.setPassword(passwordEncoder.encode(clientDto.getPassword()));
        client.setPhone(clientDto.getPhone());
        client.setAddress(clientDto.getAddress());

        String token = jwtProvider.generateToken(clientDto.getName());

        client.setToken(token);

        Client savedClient = clientRepository.save(client);

        return mapToResponse(savedClient);
    }


    public ClientResponseDto loginClient(ClientLoginRequestDto dto){

        Client client = clientRepository.findByEmail(dto.getEmail())
                .orElseThrow(()-> new RuntimeException("Invalid email or password"));

        if(!passwordEncoder.matches(dto.getPassword(), client.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtProvider.generateToken(dto.getEmail());
        client.setToken(token);

        clientRepository.save(client);

        return  mapToResponse(client);
    }


    private ClientResponseDto mapToResponse(Client client) {
        return ClientResponseDto.builder()
                .name(client.getName())
                .email(client.getEmail())
                .phone(client.getPhone())
                .address(client.getAddress())
                .token(client.getToken())
                .build();
    }
}