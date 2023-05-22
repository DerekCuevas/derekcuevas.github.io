---
title: "Securely Storing Secrets in Rust"
date: 2023-05-22T12:03:21.383Z
tags: []
---

Security, Rust, Cryptography

---

As software engineers, we often have to handle confidential information such as passwords, access tokens, and API keys, which should not be hardcoded in our applications. Leaking even small pieces of this sensitive data can have severe consequences, including financial loss, reputational damage, and legal issues. Therefore, it's crucial to properly secure this information to prevent it from falling into the wrong hands.

In this post, we'll explore some of the methods we can use to securely store secrets in our Rust applications. We'll begin by discussing why we should avoid hardcoding secrets, then examine some conventional approaches to storing them. Afterward, we'll take a deep dive into Rust's crypto libraries and explore how to use them to encrypt and decrypt secrets properly.

## Why You Shouldn't Hardcode Secrets

Hardcoding your secrets directly in your source code is a terrible idea. Consider the following example:

```rust
let password = "mysecretpassword";
```

In this example, the password is hardcoded into the application, meaning it's visible to anyone who has access to the source code repository, which could include potential attackers or malicious insiders. Even if the application is compiled into a binary, the password may still be visible in the binary file as plaintext. Additionally, when you need to update the password, you must modify the source code and recompile the application, which defeats the purpose of keeping secrets confidential.

## Conventional Approaches to Storing Secrets

Before we dive into Rust's cryptography libraries, let's first examine some conventional methods of storing secrets.

### Environment Variables

One common approach to storing secrets is to use environment variables. The primary benefit of this approach is that it keeps the secrets outside of your source code, making it easy to change them without modifying the application's code. For example, you might store a password as an environment variable like this:

```bash
export PASSWORD=mysecretpassword
```

In Rust, you can retrieve this value using the `std::env` module:

```rust
let password = std::env::var("PASSWORD").unwrap();
```

This approach works well for simple secrets, but it has some drawbacks. First, it requires additional setup outside of the application. Second, it's not entirely foolproof, as `env` variables may be visible to other applications running on the same machine.

### Configuration Files

Another alternative to environment variables is to use configuration files. A configuration file is external to the application and can have its permissions set to be only visible to the application owner. However, like environment variables, configuration files can't provide complete security against data breaches. Secrets stored in configuration files can be exposed if the file is not correctly secured.

```rust
// Example of reading values from a configuration file with serde

#[derive(Debug, Deserialize)]
struct Config {
    username: String,
    password: String,
    token: String,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let content = std::fs::read_to_string("config.toml")?;
    let config: Config = toml::from_str(&content)?;
    Ok(())
}
```

## Cryptography Libraries

Now that we've discussed some conventional approaches, let's explore Rust's cryptography libraries. Rust has several cryptography libraries that provide various levels of security and functionality. In the following sections, we'll look at two of them: Sodiumoxide and RustCrypto.

### Sodiumoxide

Sodiumoxide is an easy-to-use library for Rust that provides cryptographic primitives and utilities. Sodiumoxide offers several cryptographic primitives, including symmetric-key cryptography (such as key generation, encryption, and decryption) and public-key cryptography (such as signing operations). In our example, we'll use sodiumoxide to encrypt and decrypt a password.

```rust
use sodiumoxide::{
    crypto::{
        pwhash::{self, Salt},
        secretbox::{self, Key},
    },
    randombytes,
};

// Generate a random salt
let salt = Salt::new(&randombytes::randombytes(16));

// Derive a key from a password and salt
let password = "mysecretpassword";
let mut derived_key = Key([0; secretbox::KEYBYTES]);
pwhash::derive_key(
    &mut derived_key,
    password.as_bytes(),
    &salt,
    pwhash::OPSLIMIT_INTERACTIVE,
    pwhash::MEMLIMIT_INTERACTIVE,
).unwrap();

// Encrypt a secret using the derived key
let secret = "mysecret";
let nonce = secretbox::Nonce::from_slice(&randombytes::randombytes(24)).unwrap();
let ciphertext = secretbox::seal(
    secret.as_bytes(),
    &nonce,
    &secretbox::Key::from_slice(&derived_key.0).unwrap(),
);

// Decrypt the encrypted secret using the derived key
let plaintext = secretbox::open(
    &ciphertext,
    &nonce,
    &secretbox::Key::from_slice(&derived_key.0).unwrap(),
).unwrap();
let decrypted_secret = std::str::from_utf8(&plaintext).unwrap();
assert_eq!(secret, decrypted_secret);
```

Here, we use sodiumoxide to generate a salt, derive a key from the password and salt, encrypt a secret, and decrypt the encrypted secret using the derived key.

### RustCrypto

RustCrypto is another cryptography library for Rust. RustCrypto offers cryptographic primitives such as symmetric-key cryptography (including block ciphers, stream ciphers, and authenticated encryption with associated data) and hashing.

```rust
use aes::Aes256;
use block_modes::{BlockMode, Cbc};
use block_padding::Pkcs7;
use rand::rngs::OsRng;
use rand::RngCore;

type Aes256Cbc = Cbc<Aes256, Pkcs7>;

fn encrypt(secret: &[u8], key: &[u8], iv: &[u8]) -> Vec<u8> {
    let cipher = Aes256Cbc::new_from_slices(key, iv).unwrap();
    let mut encrypted = secret.to_vec();
    let padding_required = cipher.block_size() - (secret.len() % cipher.block_size());
    let padding_vec = vec![padding_required as u8; padding_required];
    encrypted.extend_from_slice(&padding_vec);

    let mut ciphertext = vec![0u8; encrypted.len()];
    cipher.encrypt(&mut encrypted, &mut ciphertext);

    ciphertext
}

fn decrypt(ciphertext: &[u8], key: &[u8], iv: &[u8]) -> Vec<u8> {
    let cipher = Aes256Cbc::new_from_slices(key, iv).unwrap();

    let mut plaintext = vec![0u8; ciphertext.len()];
    let mut decrypted = vec![0u8; ciphertext.len()];
    cipher.decrypt(ciphertext, &mut decrypted).unwrap();

    let padding_len = decrypted[decrypted.len() - 1] as usize;
    plaintext.extend_from_slice(&decrypted[..decrypted.len() - padding_len]);

    plaintext
}

let password = "mysecretpassword";
let key = [0u8; 32];
let mut iv = [0u8; 16];
OsRng.fill_bytes(&mut iv);

let secret = "mysecret".as_bytes();
let ciphertext = encrypt(secret, &key, &iv);
let plaintext = decrypt(&ciphertext, &key, &iv);
assert_eq!(plaintext, secret);
```

In this example, we use RustCrypto to define an encryption and decryption function that uses AES-256 in CBC mode. We generate a random initialization vector and a 256-bit key. Then, we encrypt and decrypt a secret using the defined functions.

## Conclusion

Securing secrets is a crucial aspect of building software applications. Rust provides several cryptography libraries, such as Sodiumoxide and RustCrypto, that help us securely store secrets.

Using environment variables and configuration files are conventional ways of storing secrets; however, cryptography libraries offer a more secure approach.
