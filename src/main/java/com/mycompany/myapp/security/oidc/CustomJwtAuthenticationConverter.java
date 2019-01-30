package com.mycompany.myapp.security.oidc;

import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class CustomJwtAuthenticationConverter extends JwtAuthenticationConverter {

    // TODO this should be updated to work both with keycloak default and OKTA
    protected Collection<GrantedAuthority> extractAuthorities(Jwt jwt) {
        Map<String, Object> clientRoles = jwt.getClaimAsMap("resource_access");
        Stream<String> roles = clientRoles.entrySet().stream()
            .flatMap(c -> ((JSONArray) ((JSONObject) c.getValue()).get("roles"))
                .stream().map(r -> this.clientIdToprefix(c.getKey()) + r)
            );
//        Stream<String> realmRoles = ((JSONArray) jwt.getClaimAsMap("realm_access").get("roles"))
//            .stream().map(r -> "" + r);

        return roles
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());
    }

    private String clientIdToprefix(String clientId) {
        if (clientId.equals("web_app")) {
            return "";
        }
        return clientId + "-";
    }
}
