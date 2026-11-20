window.MODS = window.MODS || [];
MODS.push({
id: "m2", num: 2, title: "Learning Models: Autoencoders, CNN, Transfer Learning", lectures: "6L", time: "1 h 30 min",
videos: ["p05", "p06"],
widgets: ["conv", "convcalc"],
why: "CNN architecture diagram + building blocks + output-size / parameter numerical — almost guaranteed.",
notes: [
{ h: "1. Unsupervised learning with deep networks", html: `
<ul><li>Labels costly; unlabelled data plentiful → learn structure without labels.</li>
<li>Goals: compression, feature learning, clustering, generation.</li>
<li>Deep unsupervised models: Autoencoders, RBM / Deep Belief Networks, VAE, GAN.</li>
<li><b>Greedy layer-wise pre-training</b>: train each layer as AE/RBM unsupervised, then fine-tune whole network with labels.</li></ul>`},
{ h: "2. Autoencoder", fig: "autoencoder", html: `
<div class="formula">Encoder z = f(Wx + b) &nbsp;&nbsp; Decoder x̂ = g(W′z + b′) &nbsp;&nbsp; Loss = ‖x − x̂‖²</div>
<ul><li>Target = input itself. <b>Bottleneck</b> (dim z &lt; dim x) forces learning important features.</li>
<li>Linear AE + MSE ≈ PCA; non-linear AE is more powerful.</li>
<li>Uses: dimensionality reduction, denoising, anomaly detection (high reconstruction error = anomaly), pre-training.</li></ul>
<p class="analogy">Analogy: 100 page book → 1 page notes (code z) → book dobara samjhana.</p>`},
{ h: "3. Types of autoencoders", fig: "denoise", html: `
<table><tr><th>Type</th><th>Idea</th></tr>
<tr><td>Undercomplete</td><td>hidden &lt; input (bottleneck)</td></tr>
<tr><td>Sparse</td><td>hidden may be large; L1 / KL sparsity penalty so few neurons active</td></tr>
<tr><td>Denoising</td><td>input corrupted x̃, target clean x: L = ‖x − g(f(x̃))‖²</td></tr>
<tr><td>Contractive</td><td>penalty ‖∂h/∂x‖² → robust features</td></tr>
<tr><td>Stacked / Deep</td><td>several AEs stacked, layer-wise training</td></tr>
<tr><td>Variational</td><td>probabilistic latent; generative (Module 5)</td></tr></table>`},
{ h: "4. Why CNN?", html: `
<ul><li>224×224×3 image = 150,528 inputs; 1000 hidden units → ~150 million weights in one layer → overfitting, compute.</li>
<li>MLP ignores spatial structure (flattening).</li>
<li>CNN ideas: <b>local receptive field</b>, <b>weight sharing</b>, <b>pooling</b> (translation invariance), hierarchy of features. Inspired by visual cortex (Hubel &amp; Wiesel); LeNet-5 (LeCun 1998).</li></ul>`},
{ h: "5. Building blocks of CNN", fig: "cnn_pipeline", html: `
<ol><li><b>Convolution layer</b>: K filters F×F slide over input, dot product → feature maps. Learnable weights + bias.</li>
<li><b>Padding (P)</b>: zero border; 'same' P = (F−1)/2; 'valid' P = 0.</li>
<li><b>Stride (S)</b>: step size of filter.</li>
<li><b>Activation (ReLU)</b>: max(0,x) after conv.</li>
<li><b>Pooling</b>: max / average, usually 2×2 stride 2; no parameters.</li>
<li><b>Flatten + Fully Connected</b>: classification.</li>
<li><b>Softmax + cross-entropy loss</b>: L = −Σ y<sub>i</sub> log p<sub>i</sub>.</li>
<li>Extras: Batch Normalization, Dropout, Data augmentation.</li></ol>
<div class="formula">Output size O = (N − F + 2P)/S + 1 &nbsp;&nbsp; Params/conv layer = (F·F·C<sub>in</sub> + 1)·C<sub>out</sub></div>`},
{ h: "6. Convolution & pooling worked example", fig: "convolution", html: `<p>Input 4×4, kernel [[1,0],[0,−1]], stride 1: top-left = 1·1 + 2·0 + 0·0 + 1·(−1) = 0. Output 3×3 = [[0,−1,−1],[−1,1,3],[2,0,−2]].</p>
<p>Pooling 2×2/2 on [[1,3,2,1],[4,6,5,0],[3,1,1,2],[0,2,4,3]] → max [[6,5],[3,4]], average [[3.5,2],[1.5,2.5]].</p>`, fig2: "pooling" },
{ h: "7. Famous CNN architectures", html: `
<table><tr><th>Model</th><th>Key idea</th></tr>
<tr><td>LeNet-5 (1998)</td><td>digit recognition; conv-pool-conv-pool-FC</td></tr>
<tr><td>AlexNet (2012)</td><td>ReLU, dropout, GPU, ImageNet winner</td></tr>
<tr><td>VGG-16</td><td>only 3×3 convs, deep and uniform</td></tr>
<tr><td>GoogLeNet</td><td>Inception module (parallel 1×1, 3×3, 5×5)</td></tr>
<tr><td>ResNet</td><td>skip / residual connections y = F(x) + x, 152 layers</td></tr></table>`},
{ h: "8. Transfer learning", fig: "transfer", html: `
<ul><li>Reuse model trained on large dataset (ImageNet) for a new task.</li>
<li><b>Feature extraction</b>: freeze conv base, train only new classifier head.</li>
<li><b>Fine-tuning</b>: unfreeze top layers, train with small learning rate.</li>
<li>Small data + similar domain → feature extraction; large data → fine-tune more.</li>
<li>Benefits: less data, less time, better accuracy. Example: pneumonia from 500 X-rays with ResNet.</li></ul>
<p class="analogy">Analogy: cycle chalaana aata hai to bike seekhna aasaan.</p>`}
],
short: [
{ q: "What is an autoencoder? Explain with diagram. How is it related to PCA?", a: `Encoder–bottleneck–decoder; trained to reconstruct input; loss ‖x−x̂‖². Linear AE with MSE spans the same subspace as top principal components (PCA); non-linear AE learns curved manifolds.`, fig: "autoencoder" },
{ q: "Explain denoising and sparse autoencoders.", a: `Denoising: corrupt input (Gaussian noise / masking), reconstruct clean target → learns robust features, used for image denoising. Sparse: add penalty λΣ|h| or KL(ρ‖ρ̂) to keep average activation small → each neuron specializes.` },
{ q: "Explain convolution, padding and stride with an example. Give output-size formula.", a: `Kernel slides, element-wise multiply-sum. O = (N−F+2P)/S+1. Example 32×32, F=5, P=2, S=1 → 32; 227, F=11, S=4, P=0 → 55.` },
{ q: "What is pooling? Compare max and average pooling.", a: `Down-sampling, no learnable parameters, reduces computation and overfitting, gives translation invariance. Max keeps strongest activation (texture/edge presence); average smooths. Global average pooling replaces FC layers.`, fig: "pooling" },
{ q: "What is transfer learning? Feature extraction vs fine-tuning.", a: `See notes section 8.`, fig: "transfer" },
{ q: "Why does CNN need fewer parameters than MLP?", a: `Local connectivity (each neuron sees F×F patch) and weight sharing (same filter over whole image). Example: 3×3 conv with 64 filters on RGB = 1,792 params vs ~150M for fully connected layer on 224×224×3.` }
],
long: [
{ q: "Draw and explain the architecture of a Convolutional Neural Network. Describe each building block.", a: `Diagram INPUT → [CONV→ReLU→POOL]×N → FLATTEN → FC → SOFTMAX. Explain: convolution (filters, feature maps, weight sharing, formula), padding, stride, ReLU (non-linearity, sparse), pooling (max/avg, no params), FC (combine features), softmax (probabilities) + cross-entropy, batch norm/dropout. Feature hierarchy edges → parts → objects. Mention LeNet/AlexNet/VGG/ResNet. Add output-size & parameter formula with one example.`, fig: "cnn_pipeline" },
{ q: "Explain autoencoders. Discuss undercomplete, sparse, denoising, contractive and stacked autoencoders with applications.", a: `Definition + diagram + loss; then table of types; applications: compression, denoising, anomaly detection, pre-training of deep nets, feature learning; relation to PCA; VAE as generative extension.`, fig: "autoencoder" },
{ q: "What is transfer learning? Explain strategies and when to use each. Give a real example.", a: `Definition, why it works (generic low-level features), steps: load pre-trained model, remove top, add new head, freeze, train, optionally unfreeze top layers with small η. 2×2 decision: dataset size × similarity. Example: medical X-ray classification with ImageNet ResNet; benefits and risks (negative transfer if domains very different).`, fig: "transfer" }
],
numericals: [
{ q: "Input 32×32×3; conv 5×5, 6 filters, S=1, P=0 → pool 2×2/2 → conv 5×5, 16 filters → pool 2×2/2 → FC 120 → FC 84 → FC 10. Find each output size and parameters (LeNet-style).", a: `Conv1: (32−5)/1+1 = 28 → 28×28×6; params (5·5·3+1)·6 = 456.<br>Pool1: 14×14×6; 0 params.<br>Conv2: (14−5)+1 = 10 → 10×10×16; params (5·5·6+1)·16 = 2,416.<br>Pool2: 5×5×16 = 400 values.<br>FC120: 400·120+120 = 48,120. FC84: 120·84+84 = 10,164. FC10: 84·10+10 = 850.<br><b>Total = 62,006</b>.` },
{ q: "Compute the 2×2 convolution of the given 4×4 input with kernel [[1,0],[0,−1]] (stride 1).", a: `Each output = I[i][j] − I[i+1][j+1]. Input [[1,2,0,1],[0,1,3,1],[2,1,0,0],[1,0,1,2]] → [[0,−1,−1],[−1,1,3],[2,0,−2]].`, fig: "convolution" },
{ q: "Output size: (a) 64×64, F=3, P=1, S=1; (b) 64×64, F=3, P=1, S=2; (c) 227×227, F=11, P=0, S=4.", a: `(a) (64−3+2)/1+1 = 64. (b) (64−3+2)/2+1 = 32 (floor of 32.5). (c) (227−11)/4+1 = 55.` },
{ q: "Softmax of scores (2.0, 1.0, 0.1) and cross-entropy if true class is first.", a: `e<sup>2</sup>=7.389, e<sup>1</sup>=2.718, e<sup>0.1</sup>=1.105; sum 11.212 → p = (0.659, 0.242, 0.099). CE = −ln 0.659 = 0.417.` }
]
});
