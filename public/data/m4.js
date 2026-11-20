window.MODS = window.MODS || [];
MODS.push({
id: "m4", num: 4, title: "Learning Models: Optimizers, Supervised Tasks with DL, LSTM", lectures: "8L", time: "1 h 45 min",
videos: ["p08", "p09"],
widgets: ["optim", "lstm"],
why: "Optimizers (GD, Momentum, RMSProp, Adam) appear in BOTH Module 4 and 5 — very high probability. LSTM diagram + equations is a classic 10–15 mark question.",
notes: [
{ h: "1. Gradient descent (revisited)", fig: "gd", html: `
<div class="formula">w ← w − η ∇<sub>w</sub>L(w)</div>
<p>Move opposite to gradient. Problems: same η for all parameters; zig-zag in ravines (ill-conditioned loss); slow on plateaus; stuck at saddle points; sensitive to η.</p>
<p class="analogy">Analogy: andhere mein pahaad se utarna — pairon se slope mehsoos karke neeche ki taraf kadam.</p>`},
{ h: "2. Momentum", html: `
<div class="formula">v<sub>t</sub> = β v<sub>t−1</sub> + η ∇L(w) &nbsp;&nbsp; w ← w − v<sub>t</sub> &nbsp;&nbsp; (β ≈ 0.9)</div>
<p>Accumulates past gradients: accelerates along consistent directions, damps oscillations, helps cross small local minima/plateaus. <b>Nesterov</b>: gradient evaluated at look-ahead point w − βv.</p>`},
{ h: "3. RMSProp", html: `
<div class="formula">s<sub>t</sub> = β s<sub>t−1</sub> + (1 − β) g<sub>t</sub>² &nbsp;&nbsp; w ← w − η g<sub>t</sub> / (√s<sub>t</sub> + ε)</div>
<p>Per-parameter adaptive learning rate: large gradients → smaller steps, small gradients → larger steps. Fixes AdaGrad's ever-decreasing rate by using exponential moving average (Hinton). β ≈ 0.9, ε ≈ 10<sup>−8</sup>.</p>`},
{ h: "4. Adam (Adaptive Moment Estimation)", fig: "gd_all", html: `
<div class="formula">m<sub>t</sub> = β<sub>1</sub>m<sub>t−1</sub> + (1−β<sub>1</sub>)g<sub>t</sub> &nbsp;&nbsp; v<sub>t</sub> = β<sub>2</sub>v<sub>t−1</sub> + (1−β<sub>2</sub>)g<sub>t</sub>²<br>
m̂<sub>t</sub> = m<sub>t</sub>/(1−β<sub>1</sub><sup>t</sup>) &nbsp;&nbsp; v̂<sub>t</sub> = v<sub>t</sub>/(1−β<sub>2</sub><sup>t</sup>) &nbsp;&nbsp; w ← w − η m̂<sub>t</sub>/(√v̂<sub>t</sub> + ε)</div>
<p>Momentum (1st moment) + RMSProp (2nd moment) + <b>bias correction</b> (m, v start at 0). Defaults η = 0.001, β<sub>1</sub> = 0.9, β<sub>2</sub> = 0.999, ε = 10<sup>−8</sup>.</p>
<table><tr><th>Optimizer</th><th>Uses</th><th>Pros</th><th>Cons</th></tr>
<tr><td>GD/SGD</td><td>gradient</td><td>simple</td><td>zig-zag, fixed η</td></tr>
<tr><td>Momentum</td><td>+ velocity</td><td>faster, less oscillation</td><td>overshoot, extra β</td></tr>
<tr><td>RMSProp</td><td>+ avg of g²</td><td>per-param η</td><td>no momentum term</td></tr>
<tr><td>Adam</td><td>m + v + bias corr.</td><td>robust default, fast</td><td>may generalize slightly worse than SGD+mom</td></tr></table>`},
{ h: "5. Classical supervised tasks with deep learning", fig: "seg_det", html: `
<table><tr><th>Task</th><th>Output</th><th>Models</th><th>Loss / metric</th></tr>
<tr><td>Classification</td><td>1 label per image</td><td>CNN (ResNet…)</td><td>cross-entropy / accuracy</td></tr>
<tr><td>Object detection</td><td>boxes (x,y,w,h) + class + score</td><td>R-CNN, Fast/Faster R-CNN (two-stage); YOLO, SSD (one-stage)</td><td>class + box regression / IoU, mAP; NMS</td></tr>
<tr><td>Semantic segmentation</td><td>label per pixel</td><td>FCN, U-Net, SegNet, DeepLab</td><td>pixel-wise CE / mIoU, Dice</td></tr>
<tr><td>Instance segmentation</td><td>mask per object</td><td>Mask R-CNN</td><td>—</td></tr>
<tr><td>Image denoising</td><td>clean image</td><td>denoising AE, DnCNN (residual)</td><td>MSE / PSNR, SSIM</td></tr></table>
<div class="formula">IoU = area(A ∩ B) / area(A ∪ B)</div>`, fig2: "denoise" },
{ h: "6. Recurrent Neural Network", fig: "rnn_unroll", html: `
<div class="formula">h<sub>t</sub> = tanh(W h<sub>t−1</sub> + U x<sub>t</sub> + b) &nbsp;&nbsp; y<sub>t</sub> = softmax(V h<sub>t</sub>)</div>
<p>Hidden state = memory; same weights at every time step; trained by <b>Backpropagation Through Time (BPTT)</b>. Problem: vanishing/exploding gradients → cannot learn long-term dependencies. Exploding → gradient clipping.</p>`},
{ h: "7. LSTM (Hochreiter & Schmidhuber, 1997)", fig: "lstm", html: `
<div class="formula">f<sub>t</sub> = σ(W<sub>f</sub>[h<sub>t−1</sub>, x<sub>t</sub>] + b<sub>f</sub>) &nbsp; i<sub>t</sub> = σ(W<sub>i</sub>[h<sub>t−1</sub>, x<sub>t</sub>] + b<sub>i</sub>) &nbsp; C̃<sub>t</sub> = tanh(W<sub>C</sub>[h<sub>t−1</sub>, x<sub>t</sub>] + b<sub>C</sub>)<br>
C<sub>t</sub> = f<sub>t</sub> ⊙ C<sub>t−1</sub> + i<sub>t</sub> ⊙ C̃<sub>t</sub> &nbsp;&nbsp; o<sub>t</sub> = σ(W<sub>o</sub>[h<sub>t−1</sub>, x<sub>t</sub>] + b<sub>o</sub>) &nbsp;&nbsp; h<sub>t</sub> = o<sub>t</sub> ⊙ tanh(C<sub>t</sub>)</div>
<ul><li>Cell state = conveyor belt; additive update lets gradients flow (constant error carousel) → long-term memory.</li>
<li>Forget gate: what to erase; input gate: what to write; output gate: what to expose.</li>
<li>GRU: update + reset gates (2 gates), no separate cell state.</li>
<li>Applications: language modelling, machine translation, speech recognition, time-series forecasting, video captioning.</li></ul>`}
],
short: [
{ q: "Explain momentum-based gradient descent. Why is it faster than plain GD?", a: `Formula; velocity accumulates; consistent directions add up, oscillating ones cancel → larger effective step along valley, fewer zig-zags. Analogy heavy ball.`, fig: "gd_all" },
{ q: "Write the RMSProp algorithm. How does it differ from AdaGrad?", a: `AdaGrad: s = s + g² (sum) → η/√s keeps shrinking to ~0. RMSProp: exponential moving average s = βs + (1−β)g² → effective η stays reasonable.` },
{ q: "Write the Adam algorithm. What is bias correction and why is it needed?", a: `Algorithm in notes. m,v initialized to 0 → biased towards 0 in early steps; dividing by (1−β<sup>t</sup>) gives unbiased estimates. Example t=1: m = 0.1g, m̂ = g.` },
{ q: "Differentiate classification, object detection and semantic segmentation.", a: `Use the table; draw the 3-panel figure.`, fig: "seg_det" },
{ q: "What is IoU? Compute IoU of boxes A = (0,0,4,4) and B = (2,2,6,6).", a: `Intersection 2×2 = 4; union 16 + 16 − 4 = 28; IoU = 4/28 = 0.143.` },
{ q: "Why do RNNs suffer from vanishing gradient? How does LSTM solve it?", a: `BPTT multiplies by W and tanh′ (≤1) at every step → product shrinks exponentially. LSTM cell update is additive (C<sub>t</sub> = f⊙C<sub>t−1</sub> + i⊙C̃) so ∂C<sub>t</sub>/∂C<sub>t−1</sub> = f (≈1 when gate open) → gradient preserved.` }
],
long: [
{ q: "Explain Gradient Descent, Momentum, RMSProp and Adam optimizers with update equations. Compare them.", a: `All four formulas, intuition and analogy, comparison table, hyper-parameter defaults, figure of paths on contour.`, fig: "gd_all" },
{ q: "Draw the LSTM cell and explain the function of each gate with equations. How does LSTM overcome the limitations of RNN?", a: `Diagram with cell state line, three sigmoid gates, tanh candidate; equations; explain each gate with sentence example (gender of subject); additive update → no vanishing gradient; applications; compare GRU.`, fig: "lstm" },
{ q: "Discuss classical supervised tasks with deep learning: image denoising, semantic segmentation and object detection.", a: `For each: problem, input/output, typical architecture (DnCNN/DAE; FCN/U-Net with encoder–decoder + skip; R-CNN family vs YOLO/SSD), loss and metrics (PSNR/SSIM; pixel CE, mIoU; IoU, mAP, NMS), applications (medical, autonomous driving, surveillance).`, fig: "seg_det" }
],
numericals: [
{ q: "f(w) = w², w<sub>0</sub> = 2, η = 0.1. Do two steps of GD, Momentum (β=0.9, v=βv+ηg), RMSProp (β=0.9) and Adam.", a: `GD: g=4 → w=1.6; g=3.2 → w=1.28.<br>Momentum: v=0.4 → w=1.6; g=3.2, v=0.36+0.32=0.68 → w=0.92.<br>RMSProp: s=0.1·16=1.6 → w=2−0.1·4/1.265=1.684; g=3.368, s=1.44+1.134=2.574 → w=1.684−0.1·3.368/1.604=1.474.<br>Adam: t=1: m=0.4, v=0.016, m̂=4, v̂=16 → w=2−0.1·4/4=1.9; t=2: g=3.8, m=0.74, v=0.03042, m̂=3.895, v̂=15.22 → w=1.9−0.1·3.895/3.901=1.800.` },
{ q: "LSTM scalar step: f=0.8, i=0.6, C̃=0.5, C<sub>t−1</sub>=1.0, o=0.9. Find C<sub>t</sub> and h<sub>t</sub>.", a: `C<sub>t</sub> = 0.8·1.0 + 0.6·0.5 = 1.1; h<sub>t</sub> = 0.9·tanh(1.1) = 0.9·0.8005 = 0.720.` },
{ q: "IoU of A=(0,0,4,4) and B=(2,2,6,6).", a: `4 / 28 = 0.143 (not a correct detection at threshold 0.5).` }
]
});
