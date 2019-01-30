package com.mycompany.myapp.config.apidoc;

import io.github.jhipster.config.JHipsterConstants;
import org.springframework.cloud.netflix.zuul.filters.Route;
import org.springframework.cloud.netflix.zuul.filters.RouteLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.spi.service.contexts.SecurityContext;
import springfox.documentation.swagger.web.SecurityConfiguration;
import springfox.documentation.swagger.web.SecurityConfigurationBuilder;
import springfox.documentation.swagger.web.SwaggerResource;
import springfox.documentation.swagger.web.SwaggerResourcesProvider;

import java.util.ArrayList;
import java.util.List;

/**
 * Retrieves all registered microservices Swagger resources.
 */
@Component
@Primary
@Profile(JHipsterConstants.SPRING_PROFILE_SWAGGER)
public class GatewaySwaggerResourcesProvider implements SwaggerResourcesProvider {

    private final RouteLocator routeLocator;

    public GatewaySwaggerResourcesProvider(RouteLocator routeLocator) {
        this.routeLocator = routeLocator;
    }

    @Override
    public List<SwaggerResource> get() {
        List<SwaggerResource> resources = new ArrayList<>();

        //Add the default swagger resource that correspond to the gateway's own swagger doc
        resources.add(swaggerResource("default", "/v2/api-docs"));

        //Add the registered microservices swagger docs as additional swagger resources
        List<Route> routes = routeLocator.getRoutes();
        routes.forEach(route -> {
            resources.add(swaggerResource(route.getId(), route.getFullPath().replace("**", "v2/api-docs")));
        });

        return resources;
    }



    private SwaggerResource swaggerResource(String name, String location) {
        SwaggerResource swaggerResource = new SwaggerResource();
        swaggerResource.setName(name);
        swaggerResource.setLocation(location);
        swaggerResource.setSwaggerVersion("2.0");
        return swaggerResource;
    }

    //TODO swagger support should improved
    private SecurityContext securityContext() {
        return SecurityContext.builder()
            .securityReferences(new ArrayList<>())
            .forPaths(PathSelectors.regex(".*"))
            .build();
    }

    @Bean
    SecurityConfiguration security() {
        return SecurityConfigurationBuilder.builder()
            .clientId("web_app")
            .clientSecret(null)
            .realm("jhipster")
            .appName("corpman")
            .scopeSeparator(",")
            .additionalQueryStringParams(null)
            .useBasicAuthenticationWithAccessCodeGrant(false)
            .build();
    }
}
