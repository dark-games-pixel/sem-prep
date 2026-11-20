window.MODS = window.MODS || [];
MODS.push({
id: "m5", num: 5, title: "Optimization & Generative Modelling: VAE, GAN", lectures: "10L", time: "1 h 45 min",
videos: ["p08", "p10"],
widgets: ["optim", "gan"],
why: "Biggest module by lectures. VAE and GAN (diagram + loss + training) are near-certain long questions; batch/mini-batch/SGD a frequent short one.",
notes: [
{ h: "1. The optimization problem in deep learning", fig: "lr_effect", html: `
<div class="formula">J(w) = (1/N) Σ<sub>i</sub> L(f(x<sub>i</sub>; w), y<sub>i</sub>) + λ R(w)</div>
<ul><li>Non-convex: many local minima, saddle points, plateaus; high-dimensional.</li>
<li>Learning rate = most important hyper-parameter; use schedules: step decay, exponential decay, cosine annealing, warm-up.</li>
<li>Helpers: Xavier/He initialization, Batch Normalization, gradient clipping, early stopping, dropout, L2 weight decay, data normalization.</li>
<li>Second-order methods (Newton, L-BFGS) use curvature (Hessian) — costly for large nets.</li></ul>`},
{ h: "2. Batch, Stochastic and Mini-batch GD", fig: "batch_types", html: `
<table><tr><th>Variant</th><th>Samples per update</th><th>Updates/epoch</th><th>Pros</th><th>Cons</th></tr>
<tr><td>Batch GD</td><td>all N</td><td>1</td><td>stable, exact gradient</td><td>slow, memory heavy, stuck in local minima</td></tr>
<tr><td>SGD</td><td>1</td><td>N</td><td>fast updates, noise escapes minima, online</td><td>noisy, fluctuating loss</td></tr>
<tr><td>Mini-batch</td><td>B (32–256)</td><td>N/B</td><td>GPU parallel, balanced, standard</td><td>choose B</td></tr></table>
<p>Epoch = one pass over data; iteration = one update. N = 1000, B = 100 → 10 iterations/epoch.</p>`},
{ h: "3. Momentum, RMSProp, Adam (revisited)", fig: "gd_all", html: `<p>Same as Module 4 — learn the four update equations, bias correction and the comparison table. Common question: "Revisit gradient descent and explain momentum, RMSProp and Adam."</p>`},
{ h: "4. Generative modelling with deep learning", html: `
<ul><li>Discriminative: learns P(y|x) / boundary. Generative: learns P(x) or P(x,y) → can <b>sample new data</b>.</li>
<li>Deep generative families: VAE (latent variable, explicit ELBO), GAN (adversarial, implicit), autoregressive (PixelCNN, GPT), flows, diffusion models.</li>
<li>Applications: image synthesis, super-resolution, data augmentation, inpainting, style transfer, anomaly detection.</li></ul>`},
{ h: "5. Variational Autoencoder (VAE)", fig: "vae", html: `
<ul><li>Encoder q<sub>φ</sub>(z|x) outputs <b>μ and σ</b> (a distribution), not a point. Decoder p<sub>θ</sub>(x|z).</li>
<li><b>Reparameterization trick</b>: z = μ + σ ⊙ ε, ε ~ N(0, I) → backprop possible.</li></ul>
<div class="formula">Loss = −ELBO = −E<sub>q</sub>[log p(x|z)] + KL(q(z|x) ‖ N(0, I))<br>KL (Gaussian) = ½ Σ (μ² + σ² − 1 − log σ²)</div>
<ul><li>Reconstruction term → faithful output; KL term → latent space smooth, continuous, near N(0,I) (no gaps).</li>
<li>Generate: sample z ~ N(0, I) → decoder. Latent interpolation gives smooth morphs.</li></ul>
<p class="analogy">Analogy: normal AE = points with gaps; VAE = clouds that overlap.</p>`},
{ h: "6. Generative Adversarial Network (GAN)", fig: "gan", html: `
<ul><li>Goodfellow et al., 2014. Generator G(z) maps noise to fake data; Discriminator D(x) outputs probability x is real.</li></ul>
<div class="formula">min<sub>G</sub> max<sub>D</sub> V(D,G) = E<sub>x~p<sub>data</sub></sub>[log D(x)] + E<sub>z~p<sub>z</sub></sub>[log(1 − D(G(z)))]</div>
<ol><li>Sample minibatch of real x and noise z.</li><li>Update D by ascending ∇[log D(x) + log(1 − D(G(z)))] (k steps).</li>
<li>Update G by descending ∇ log(1 − D(G(z))) — in practice <b>maximize log D(G(z))</b> (non-saturating).</li><li>Repeat.</li></ol>
<p>Optimal D*(x) = p<sub>data</sub>/(p<sub>data</sub> + p<sub>g</sub>); at equilibrium p<sub>g</sub> = p<sub>data</sub>, D = ½ (global optimum minimizes JS divergence).</p>
<p class="analogy">Analogy: nakli note chhaapne wala (G) vs police (D).</p>`},
{ h: "7. GAN problems & variants; VAE vs GAN", html: `
<ul><li>Problems: <b>mode collapse</b>, non-convergence/instability, vanishing gradient for G when D too strong, evaluation difficulty (FID, IS).</li>
<li>Variants: DCGAN (conv guidelines), Conditional GAN, WGAN (Wasserstein loss), CycleGAN (unpaired translation), SRGAN (super-resolution), StyleGAN.</li></ul>
<table><tr><th></th><th>VAE</th><th>GAN</th></tr>
<tr><td>Training</td><td>stable, single loss</td><td>adversarial minimax, unstable</td></tr>
<tr><td>Samples</td><td>blurrier</td><td>sharp, realistic</td></tr>
<tr><td>Density</td><td>explicit lower bound (ELBO)</td><td>implicit</td></tr>
<tr><td>Encoder</td><td>yes, meaningful latent</td><td>no (basic GAN)</td></tr>
<tr><td>Failure mode</td><td>blur</td><td>mode collapse</td></tr></table>`}
],
short: [
{ q: "Compare batch, stochastic and mini-batch gradient descent.", a: `Use the table; add epoch vs iteration example.`, fig: "batch_types" },
{ q: "What is the reparameterization trick in VAE? Why is it needed?", a: `Sampling z ~ N(μ,σ²) is not differentiable w.r.t. μ, σ. Write z = μ + σ⊙ε with ε ~ N(0,I) independent of parameters → gradient flows through μ and σ; randomness isolated in ε.` },
{ q: "Write the loss function of VAE and explain both terms.", a: `Reconstruction (−log p(x|z), e.g., MSE/BCE) keeps output similar; KL(q(z|x)‖N(0,I)) regularizes latent space to be smooth and allow sampling. Gaussian KL formula.` },
{ q: "What is mode collapse in GAN? How can it be reduced?", a: `G produces limited variety (few modes) because they fool D. Remedies: minibatch discrimination, WGAN, unrolled GAN, feature matching, label smoothing, conditional GANs.` },
{ q: "Differentiate discriminative and generative models.", a: `P(y|x) vs P(x)/P(x,y); boundary vs data distribution; examples (logistic regression, CNN classifier, SVM vs Naive Bayes, VAE, GAN); generative can sample new data.` },
{ q: "Why is the non-saturating generator loss used in GAN?", a: `Early in training D easily rejects fakes, D(G(z)) ≈ 0, so log(1 − D(G(z))) saturates (tiny gradient). Maximizing log D(G(z)) gives strong gradients early.` }
],
long: [
{ q: "Explain the Variational Autoencoder with a neat diagram. Derive/explain its loss and the reparameterization trick. How is it used to generate data?", a: `Diagram x → encoder → (μ, σ) → z = μ+σ⊙ε → decoder → x̂. Probabilistic view: maximize ELBO = E<sub>q</sub>[log p(x|z)] − KL(q(z|x)‖p(z)). Reparameterization trick. Gaussian KL formula. Training loop. Generation by sampling prior; interpolation; comparison with AE; applications.`, fig: "vae" },
{ q: "Explain the architecture and training algorithm of a Generative Adversarial Network. Write the minimax objective. Discuss challenges and applications.", a: `Diagram (noise → G → fake; real; → D → real/fake). Minimax objective; alternating training algorithm (k steps D, 1 step G); optimal D* and equilibrium; non-saturating loss; challenges (mode collapse, instability, vanishing gradient, evaluation); variants (DCGAN, cGAN, WGAN, CycleGAN, SRGAN); applications; VAE vs GAN table.`, fig: "gan" },
{ q: "Discuss optimization techniques used in training deep networks: batch optimization, learning rate schedules, momentum, RMSProp and Adam.", a: `Optimization problem J(w); batch/mini-batch/SGD table; LR schedules; four optimizer equations; bias correction; initialization, batch norm, gradient clipping, early stopping; comparison.`, fig: "gd_all" }
],
numericals: [
{ q: "N = 50,000 training samples, batch size 250, 20 epochs. How many weight updates for batch GD, SGD and mini-batch?", a: `Batch: 1 × 20 = 20. SGD: 50,000 × 20 = 1,000,000. Mini-batch: (50,000/250) × 20 = 200 × 20 = 4,000.` },
{ q: "1-D VAE: μ = 1.0, σ = 0.5. Compute the KL term KL(N(μ,σ²) ‖ N(0,1)). If ε = 0.4, find z.", a: `KL = ½(μ² + σ² − 1 − ln σ²) = ½(1 + 0.25 − 1 − ln 0.25) = ½(0.25 + 1.386) = 0.818. z = μ + σε = 1.0 + 0.5·0.4 = 1.2.` },
{ q: "GAN: at a point x, p<sub>data</sub>(x) = 0.3 and p<sub>g</sub>(x) = 0.1. What is the optimal discriminator output? What is it at equilibrium?", a: `D*(x) = 0.3/(0.3 + 0.1) = 0.75. At equilibrium p<sub>g</sub> = p<sub>data</sub> ⇒ D* = 0.5 everywhere.` }
]
});
