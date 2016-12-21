package de.zalando.zally.cli;

import com.github.ryenus.rop.OptionParser;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.Reader;


@OptionParser.Command(name = "zally", descriptions = "Lints the given swagger file using Zally service")
public class Main {
    public static void main(String[] args) {
        OptionParser parser = new OptionParser(Main.class);
        parser.parse(args);
    }

    void run(String[] args) {
        try {
            lint(args);
        } catch (RuntimeException e) {
            System.err.println(e.getMessage());
            System.exit(1);
        }
    }

    private void lint(String[] args) throws RuntimeException {
        if (args.length < 1) {
            throw new RuntimeException("Please provide a swagger file");
        }

        final SpecsReader specsReader;
        if (args[0].endsWith(".yaml") || args[0].endsWith(".yml")) {
            specsReader = new YamlReader(getReader(args[0]));
        } else {
            specsReader = new JsonReader(getReader(args[0]));
        }

        final RequestDecorator decorator = new RequestDecorator(specsReader);
        final String body = decorator.getRequestBody();

        // TODO: add API call
        System.out.println(body);
    }

    private Reader getReader(String location) throws RuntimeException {
        try {
            return new FileReader(location);
        } catch (FileNotFoundException e) {
            String message = "File " + location + " is not found";
            throw new RuntimeException(message);
        }
    }

    /**
     * Example for OAuth call to zally server:
     HttpResponse<String> response = Unirest.post(System.getenv("ZALLY_URL" ... or default))
     .header("Authorization", "Bearer " + System.getenv("TOKEN"))
     .asString();
     */
}