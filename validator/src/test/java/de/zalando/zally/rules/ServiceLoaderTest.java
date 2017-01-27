package de.zalando.zally.rules;

import org.junit.Test;

import static org.assertj.core.api.Assertions.assertThat;

public class ServiceLoaderTest {

    @Test
    public void testServiceLoader() {
        RulesValidator validator = RulesValidator.get();
        assertThat(validator).isNotNull();
        assertThat(validator.getRules().size()).isEqualTo(23);
    }
}
