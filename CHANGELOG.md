# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.2] - 2025-05-23

### Added

- 10-point bonus added to each correct guess during `playerGuess` trials

### Fixed

- When `useAlternateInput` is `true`, repeated presses of `3` on the first practice trial would advance the UI state faster than the underlying state, causing an error

[1.7.2]: https://github.com/Brain-Development-and-Disorders-Lab/task_intentions/compare/v1.7.1...v1.7.2
