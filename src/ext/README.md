# Sandbox features in enki

Sandbox features allows development of new functionality with less risk and without affecting
other installations. Sandbox features are controlled by feature flags. The SandboxFeature component
is designed to support code splitting, so that each feature will be compiled into separate chunks. React
will then postpone the downloading of any given chunk until it decides it's time to render the component
inside.

## How to develop a sandbox feature

Sandbox features are placed in a folder with the same name as the feature. The feature name should be added
to the SandboxFeatures interface.

The folder should have an index.ts, with a default export. The default
export should be the main entry (React) component of your sandbox feature.

Example with a feature called `foobar`:

    //  ext/foobar/index.ts
    const Foobar: SandboxComponent<FoobarProps> = (props) => {
        return (
            <h1>{props.foo}</h1>
        )
    };

    export default Foobar;

The folder must also have
a types.d.ts file which exports the props type declaration for your component.

    // ext/foobar/types.d.ts
    export type FoobarProps extends SandboxFeatureProps = {
        foo: string;
    }

This ensures type safety across the SandboxFeature wrapper without having an explicit dependency
to your component's runtime code.

To use your sandbox feature in the main code, you'll use the SandboxFeature component
to wrap it:

    <SandboxFeature<FoobarProps>
        feature="foobar"
        foo="bar"
    />

If "foobar" is `false` in your feature flags configuration, this will not render anything.
If "foobar" is `true` it will render:

    <h1>bar</1>

A `renderFallback` function prop is also available to give the option to render something else
if the feature is not enabled:

    <SandboxFeature<FoobarProps>
        feature="foobar"
        foo="bar"
        renderFallback={() => <h1>foo</h1>}
    />

will render

    <h1>foo</h1>

if feature `foobar` is not enabled.

## How features are controlled by configuration

First of all, you must add each feature to the `SandboxFeatures` interface in `../config/config.ts`:

    interface SandboxFeatures {
        foobar: boolean;
    }

The `sandboxFeatures` property of the bootstrap configuration controls each individual feature. By default,
all features are turned off, and must be explicitly set to be enabled:

    {
        "sandboxFeatures": {
            "foobar": true
        }
    }

## Nested features

`SandboxFeature` supports nesting features 2 levels deep. Meaning, you can group several features into one
mega-feature, and configure them as one. They will also be chunked together as one file.

Example, given the following folder structure:

    // ext/foobar/foo/
    // ext/foobar/bar/

And the following feature definition:

    foobar: boolean;

and configuration setting:

    foobar: true

You can reference each sub-level feature as follows:

    <SandboxFeature<FoobarProps>
        feature="foobar/foo"
        foo="bar"
    />

and

    <SandboxFeature<FoobarProps>
        feature="foobar/bar"
        bar="foo"
    />
