// ===== Paste your YouTube links (or IDs) here after uploading. Leave "" until then. =====
window.VIDEOS = {
  p01: { yt: "", title: "Part 1 · Artificial Neuron, Perceptron, Gradient Descent", dur: "3:10" },
  p02: { yt: "", title: "Part 2 · Activation functions, Hebb rule, XOR", dur: "2:57" },
  p03: { yt: "", title: "Part 3 · ADALINE, Forward pass, Backpropagation, Convergence", dur: "3:21" },
  p04: { yt: "", title: "Part 4 · Competitive learning, SOM, ART, Hopfield", dur: "2:49" },
  p05: { yt: "", title: "Part 5 · Unsupervised DL & Autoencoders", dur: "2:00" },
  p06: { yt: "", title: "Part 6 · CNN building blocks & Transfer learning", dur: "3:19" },
  p07: { yt: "", title: "Part 7 · Bayes, Decision surfaces, Linear machine, Hinge loss", dur: "2:43" },
  p08: { yt: "", title: "Part 8 · Batch/SGD, Momentum, RMSProp, Adam", dur: "2:29" },
  p09: { yt: "", title: "Part 9 · Detection, Segmentation, RNN, LSTM", dur: "2:21" },
  p10: { yt: "", title: "Part 10 · VAE & GAN", dur: "2:31" }
};

window.FLASH = [
["MP neuron output rule", "y = 1 if Σwᵢxᵢ ≥ θ else 0 (binary inputs, fixed weights, no learning)"],
["Purpose of activation function", "Introduce non-linearity; without it stacked layers = one linear map"],
["Sigmoid derivative", "σ′ = σ(1 − σ), max 0.25 at x = 0"],
["Hebb rule", "Δw = x·t, Δb = t — 'fire together, wire together'"],
["Why bipolar for Hebb?", "Binary t = 0 ⇒ x·t = 0 ⇒ no learning for those patterns"],
["Hebb AND (bipolar) final weights", "w₁ = 2, w₂ = 2, b = −2"],
["Perceptron rule", "If y ≠ t: w ← w + αtx, b ← b + αt"],
["Perceptron convergence theorem", "Converges in finite steps if data is linearly separable"],
["ADALINE / Delta rule", "Δw = α(t − net)x — error before activation; gradient descent on ½(t − net)²"],
["Perceptron vs ADALINE (1 line)", "Perceptron: t − y after step, only on mistakes; ADALINE: t − net before step, every sample"],
["XOR with hidden layer", "h₁ = OR, h₂ = NAND, y = h₁ AND h₂"],
["Universal Approximation Theorem", "1 hidden layer with enough neurons approximates any continuous function"],
["Backprop output δ", "δₖ = (tₖ − yₖ)·yₖ(1 − yₖ)"],
["Backprop hidden δ", "δⱼ = hⱼ(1 − hⱼ)·Σₖ δₖwⱼₖ"],
["Backprop weight update", "w ← w + η·δ·(input to that weight); momentum + αΔw(t−1)"],
["MLP convergence issues", "Local minima, η choice, plateaus/saddles, vanishing gradient, overfitting, init, scaling"],
["Competitive learning update", "Winner only: w ← w + η(x − w)"],
["SOM vs competitive", "SOM updates BMU + neighbours ⇒ topology-preserving map; radius & η shrink"],
["ART solves", "Stability–plasticity dilemma (vigilance ρ, resonance, reset, new category)"],
["High vigilance ρ", "More, finer categories"],
["Hopfield weights", "W = Σ ppᵀ, symmetric, zero diagonal; energy E = −½ΣΣwᵢⱼsᵢsⱼ decreases"],
["Auto vs hetero-associative", "Auto: x → x (Hopfield); Hetero: x → y (BAM)"],
["Autoencoder loss", "‖x − x̂‖², target = input; bottleneck forces compression"],
["Linear AE ≈ ?", "PCA (with MSE loss)"],
["Denoising AE", "Noisy input x̃, clean target x"],
["Conv output size", "O = (N − F + 2P)/S + 1"],
["Conv parameters", "(F·F·C_in + 1)·C_out; pooling = 0"],
["'Same' padding", "P = (F − 1)/2 (stride 1)"],
["Why CNN over MLP", "Local connectivity, weight sharing, pooling ⇒ fewer params + translation invariance"],
["Transfer learning: small similar data", "Freeze conv base, train new head (feature extraction)"],
["Bayes theorem", "P(ω|x) = P(x|ω)P(ω)/P(x) — posterior = likelihood × prior / evidence"],
["MAP vs ML", "MAP uses prior P(θ); ML ignores it; equal when prior uniform"],
["Naive Bayes assumption", "Features conditionally independent given class"],
["Linear machine", "gᵢ(x) = wᵢᵀx + wᵢ₀, pick max; regions convex"],
["Hinge loss", "max(0, 1 − y·f(x)); zero only with margin ≥ 1"],
["SVM margin", "2/‖w‖; points on margin = support vectors"],
["Momentum", "v = βv + η∇L; w = w − v (β ≈ 0.9)"],
["RMSProp", "s = βs + (1−β)g²; w = w − ηg/(√s + ε)"],
["Adam", "m, v moments + bias correction m̂ = m/(1−β₁ᵗ); w = w − ηm̂/(√v̂ + ε)"],
["Adam defaults", "η = 0.001, β₁ = 0.9, β₂ = 0.999, ε = 10⁻⁸"],
["IoU", "Intersection / Union of boxes; ≥ 0.5 usually correct"],
["One-stage vs two-stage detectors", "One: YOLO, SSD (fast). Two: R-CNN, Fast/Faster R-CNN (accurate)"],
["Semantic segmentation models", "FCN, U-Net (encoder–decoder + skip connections)"],
["RNN hidden state", "hₜ = tanh(Whₜ₋₁ + Uxₜ + b); trained by BPTT"],
["LSTM cell update", "Cₜ = fₜ⊙Cₜ₋₁ + iₜ⊙C̃ₜ; hₜ = oₜ⊙tanh(Cₜ)"],
["Batch vs SGD vs mini-batch updates/epoch", "1 vs N vs N/B"],
["VAE reparameterization", "z = μ + σ⊙ε, ε ~ N(0, I)"],
["VAE loss", "Reconstruction + KL(q(z|x) ‖ N(0, I))"],
["GAN objective", "min_G max_D E[log D(x)] + E[log(1 − D(G(z)))]"],
["Optimal discriminator", "D*(x) = p_data/(p_data + p_g); ½ at equilibrium"],
["Mode collapse", "Generator outputs limited variety; fix: WGAN, minibatch discrimination"]
];

window.FORMULAS = [
["Neuron", "net = Σwᵢxᵢ + b, y = f(net)"],
["Sigmoid / tanh", "σ = 1/(1+e⁻ˣ), σ′ = σ(1−σ); tanh′ = 1 − tanh²"],
["Hebb", "Δw = x t, Δb = t"],
["Perceptron", "if y≠t: Δw = α t x, Δb = α t"],
["Delta / LMS", "Δw = α (t − net) x"],
["Backprop", "δₖ = (t−y)y(1−y); δⱼ = h(1−h)Σδₖwⱼₖ; Δw = η δ x"],
["Competitive / SOM", "w ← w + η h(j)(x − w); BMU = argmin‖x − w‖"],
["ART vigilance", "|I ∧ W| / |I| ≥ ρ"],
["Hopfield", "W = Σppᵀ − PI; sᵢ = sign(Σwᵢⱼsⱼ); E = −½ΣΣwᵢⱼsᵢsⱼ"],
["Conv size", "O = (N − F + 2P)/S + 1"],
["Conv params", "(F·F·C_in + 1)·C_out"],
["Softmax / CE", "pᵢ = e^{zᵢ}/Σe^{zⱼ}; L = −Σ yᵢ log pᵢ"],
["Bayes", "P(ω|x) = P(x|ω)P(ω)/Σⱼ P(x|ωⱼ)P(ωⱼ)"],
["Linear discriminant", "g(x) = wᵀx + w₀; r = g(x)/‖w‖"],
["Hinge", "max(0, 1 − y f(x)); margin 2/‖w‖"],
["GD", "w ← w − η∇L"],
["Momentum", "v ← βv + η∇L; w ← w − v"],
["RMSProp", "s ← βs + (1−β)g²; w ← w − ηg/(√s+ε)"],
["Adam", "m ← β₁m+(1−β₁)g; v ← β₂v+(1−β₂)g²; m̂, v̂ bias-corrected; w ← w − ηm̂/(√v̂+ε)"],
["IoU", "|A∩B| / |A∪B|"],
["RNN", "hₜ = tanh(Whₜ₋₁ + Uxₜ + b)"],
["LSTM", "f,i,o = σ(W[hₜ₋₁,xₜ]+b); C̃ = tanh(·); Cₜ = f⊙Cₜ₋₁ + i⊙C̃; hₜ = o⊙tanh Cₜ"],
["VAE", "z = μ+σ⊙ε; L = Recon + ½Σ(μ²+σ²−1−log σ²)"],
["GAN", "min_G max_D E log D(x) + E log(1 − D(G(z))); D* = p_d/(p_d+p_g)"]
];

window.PREDICTED = {
note: "Based on the R23 AM701 syllabus weightage and typical university end-semester patterns (short + long + numericals). Check your college's previous papers for the exact format and choices.",
groups: [
{ name: "Very likely (prepare fully)", items: [
"Back-propagation algorithm with derivation + one numerical iteration (M1)",
"Perceptron learning rule, convergence theorem, XOR limitation (M1)",
"Kohonen SOM algorithm with diagram (M1)",
"ART architecture, vigilance, stability–plasticity (M1)",
"CNN architecture + building blocks + output size / parameter numerical (M2)",
"Gradient descent, Momentum, RMSProp, Adam — equations + comparison (M4/M5)",
"LSTM cell diagram and gate equations (M4)",
"VAE: diagram, reparameterization trick, loss (M5)",
"GAN: architecture, minimax objective, training, mode collapse (M5)" ]},
{ name: "Likely (short notes / 5 marks)", items: [
"Hebb rule with AND numerical; Perceptron vs ADALINE", "Activation functions & need for non-linearity",
"Convergence issues of MLP", "Hopfield / associative memory (auto vs hetero)",
"Autoencoders and their types (denoising, sparse)", "Transfer learning: feature extraction vs fine-tuning",
"Bayes theorem with numerical; ML vs MAP; Naive Bayes", "Decision surfaces, linear machine, hinge loss",
"Batch vs mini-batch vs SGD", "Object detection vs semantic segmentation; IoU", "Image denoising with DL" ]},
{ name: "One-liners / MCQ favourites", items: [
"σ′ = σ(1−σ)", "XOR not linearly separable", "O = (N−F+2P)/S+1", "Pooling has 0 parameters", "ResNet = skip connections",
"Adam defaults 0.001/0.9/0.999", "YOLO is one-stage", "LSTM forget gate", "D* = ½ at equilibrium", "Linear AE ≈ PCA" ]}
],
paper: [
{ sec: "Group A — very short / MCQ (1 mark each, answer any 10)", qs: [
"Why is a non-linear activation function needed?", "State the Perceptron Convergence Theorem.", "Write the Delta rule.",
"What is the role of vigilance parameter in ART?", "Give the output-size formula of a convolution layer.", "How many parameters does a pooling layer have?",
"Define hinge loss.", "What is bias correction in Adam?", "Define IoU.", "Which LSTM gate removes information from cell state?",
"Write the reparameterization trick.", "What is mode collapse?" ]},
{ sec: "Group B — short answer (5 marks each, answer any 3)", qs: [
"Train a Hebb network for the AND function using bipolar inputs and targets.",
"Differentiate Perceptron and ADALINE. Why can't a perceptron solve XOR?",
"Explain max and average pooling with an example. Why are CNNs parameter-efficient?",
"A disease affects 1% of people; a test is 99% sensitive with 1% false positives. Find P(disease | +). State Bayes decision rule.",
"Compare batch, stochastic and mini-batch gradient descent." ]},
{ sec: "Group C — long answer (15 marks each, answer any 3)", qs: [
"(a) Explain the back-propagation algorithm for a 2-layer network. (b) Perform one iteration for x=(0.35,0.9), t=0.5 with the given weights. (c) List convergence issues.",
"(a) Explain Kohonen's SOM algorithm. (b) Describe ART1 and the stability–plasticity dilemma.",
"(a) Draw and explain CNN architecture. (b) For a LeNet-style network on 32×32×3, compute output sizes and parameters. (c) What is transfer learning?",
"(a) Explain Momentum, RMSProp and Adam with equations. (b) Draw the LSTM cell and explain its gates.",
"(a) Explain VAE with diagram and loss. (b) Explain GAN architecture, objective and training; compare VAE and GAN." ]}
]
};

window.PLAN = [
{ t: "0:00 – 0:20", what: "Orientation", how: "Read this home page, the predicted questions list and the exam strategy. Skim the formula sheet once (don't memorise yet)." },
{ t: "0:20 – 2:50", what: "Module 1 (most marks)", how: "Watch Parts 1–4 (12 min) at 1×, pause on each numerical. Read notes 1–15. Play with the neuron, perceptron and backprop widgets. Solve the Hebb, perceptron and backprop numericals with pen and paper. 15 MCQs." },
{ t: "2:50 – 3:05", what: "Break + flashcards M1", how: "Flip all Module 1 flashcards; mark the ones you missed." },
{ t: "3:05 – 4:35", what: "Module 2", how: "Watch Parts 5–6. Read notes. Use the conv and output-size calculators. Solve the LeNet parameter numerical. Draw the CNN diagram once from memory." },
{ t: "4:35 – 5:35", what: "Module 3", how: "Watch Part 7. Bayes and hinge widgets. Solve the 4 numericals. Write the linear-machine diagram once." },
{ t: "5:35 – 5:50", what: "Break + flashcards M2–M3", how: "Active recall only." },
{ t: "5:50 – 7:35", what: "Modules 4 & 5", how: "Watch Parts 8–10. Optimizer race and LSTM/GAN widgets. Memorise the 4 optimizer equations and LSTM equations by writing them 3 times. Draw VAE and GAN diagrams." },
{ t: "7:35 – 8:35", what: "100-MCQ test", how: "Take the full quiz in exam mode. Read the explanation of every wrong answer and revisit that note section." },
{ t: "8:35 – 9:35", what: "Model paper", how: "Attempt the predicted paper: write 2 long answers fully (backprop + CNN or VAE/GAN) under a timer." },
{ t: "9:35 – 10:00", what: "Final revision", how: "Formula sheet + flagged flashcards. Sleep." }
];

window.STRATEGY = [
"Start every long answer with a <b>diagram</b> — neuron, MLP/backprop, SOM lattice, ART, CNN pipeline, LSTM, VAE, GAN. Diagrams earn marks even if text is short.",
"Write <b>formulas in boxes</b> and define every symbol once.",
"For numericals, use a <b>table</b> (Hebb/perceptron) and show the intermediate values (net, δ, updated w). Final answer underlined.",
"Use <b>comparison tables</b>: Perceptron vs ADALINE, SOM vs competitive, Batch vs SGD, optimizers, VAE vs GAN, classification vs detection vs segmentation.",
"Finish with <b>applications / advantages / limitations</b> — 2 lines each give easy marks.",
"Attempt your strongest long question first; keep 10 minutes at the end to re-check numbers."
];
