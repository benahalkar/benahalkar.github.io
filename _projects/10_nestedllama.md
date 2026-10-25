---
layout: page
title: IBM NestedLLAMA
description: Modifying IBM's FMS Llama model to work with PyTorch Nested Tensors for memory-efficient inference.
img: assets/img/projects/nestedllama.png
importance: 1
category: work
---

**Repository:** [github.com/kushaangowda/nestedtensors-for-transformers](https://github.com/kushaangowda/nestedtensors-for-transformers)

The goal was to modify [IBM's FMS Llama model](https://www.ibm.com/products/watsonx-ai/foundation-models) to be compatible with [Nested Tensors](https://pytorch.org/tutorials/prototype/nestedtensor.html) on forward inference to make them more memory efficient with variable length data on fine-tuning — a critical factor for deploying and training models on distributed and edge devices.

Performance was time and memory profiled. Additional tasks were to find bottlenecks in PyTorch's native implementation on NestedTensors. After completing the project we raised a [PR](https://github.com/foundation-model-stack/foundation-model-stack/pull/370) on the source code.

Technologies used: HuggingFace, IBM-FMS, PyTorch, CUDA, NVIDIA profiler.
