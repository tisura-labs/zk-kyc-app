# zk-KYC App

*This project is supported by a grant from the [ZK Grants Round](https://blog.ethereum.org/2024/06/25/zk-grants-round-announce) funded by Aztec, Ethereum Foundation, Polygon, Scroll, Taiko, and Zk Sync.*


This repository comes with [a blog post](INSERT_LINK) that provides more details about its content and the concepts.

## Description

The zk-KYC app implements a [privacy-preserving KYC](https://medium.com/@tisura/privacy-preserving-kyc-57002ab8d3f2) process using zero-knowledge proofs (ZKPs). The app comprises a set of zero-knowledge circuits and a front-end application that enables users to prove and verify the validity of KYC checks without revealing sensitive data.

### KYC checks

The app demonstrates the following zk-KYC building blocks using Noir:

- **Age Verification Circuit**: Ensures that the user's age is above a specified threshold.
- **Country Verification Circuit**: Checks that the user's country is not part of a list of restricted countries.
- **Salary Verification Circuit**: Confirms that the user's recent salaries are above a specified threshold.

### How It Works

1. **Proof Generation**: The prover inputs private values into the app. The app uses NoirJS to generate zero-knowledge proofs that these values meet the KYC criteria.

2. **Proof Verification**: The prover copies the generated proof and shares it with the verifier. The verifier can independently verify the proof using their part of the app without accessing the prover's actual data.

3. **Data Privacy**: The verifier only receives the zero-knowledge proof, ensuring that the prover's personal data remains private.


## Development

### Compile the circuits

```bash
make compile
```

### Install app dependencies

```bash
make install
```

### Run app locally

```bash
make start
```
