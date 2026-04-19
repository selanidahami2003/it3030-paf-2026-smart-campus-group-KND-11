package com.smartcampus.api.security;

import com.smartcampus.api.model.Role;
import com.smartcampus.api.model.User;
import com.smartcampus.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if(userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            user = new User();
            user.setName(oAuth2User.getAttribute("name"));
            user.setEmail(email);
            // Default role for new users
            user.setRoles(Collections.singleton(Role.ROLE_USER));
            user = userRepository.save(user);
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }
}
