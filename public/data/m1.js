window.MODS = window.MODS || [];
MODS.push({
id: "m1", num: 1, title: "Introduction to Neural Networks", lectures: "8L", time: "2 h 30 min",
videos: ["p01", "p02", "p03", "p04"],
widgets: ["neuron", "activation", "perceptron", "backprop"],
why: "Sabse zyada marks wala module. Backprop, Perceptron, Hebb numerical, SOM, ART — long questions yahin se aate hain.",
notes: [
{ h: "1. Neural network kya hai?", html: `
<p><b>Artificial Neural Network (ANN)</b> = brain se inspired computing system. Bahut saare simple units (<b>neurons</b>) weighted links se jude hote hain aur <b>examples se seekhte hain</b> — weights adjust karke.</p>
<table><tr><th>Biological</th><th>Artificial</th></tr>
<tr><td>Dendrites</td><td>Inputs x</td></tr><tr><td>Synapse strength</td><td>Weight w</td></tr>
<tr><td>Soma (cell body)</td><td>Summation Σ</td></tr><tr><td>Firing threshold</td><td>Activation f</td></tr><tr><td>Axon</td><td>Output y</td></tr></table>
<p class="analogy">Analogy: bachcha billi pehchaanna examples dekh ke seekhta hai, rules se nahi. ANN bhi yahi karta hai.</p>`},
{ h: "2. Artificial neuron (McCulloch–Pitts, 1943)", fig: "neuron", html: `
<div class="formula">net = Σ w<sub>i</sub>x<sub>i</sub> + b &nbsp;&nbsp;&nbsp; y = f(net)</div>
<ul><li><b>Weight</b> = input ki importance. <b>Bias</b> = threshold ko shift karta hai.</li>
<li>MP neuron: binary inputs, <b>fixed weights</b>, threshold θ: y = 1 if net ≥ θ else 0. Isme learning nahi hoti.</li>
<li>MP neuron se AND, OR, NOT gates bana sakte hain (θ choose karke).</li></ul>`},
{ h: "3. Activation functions", fig: "activations", html: `
<table><tr><th>Function</th><th>Formula</th><th>Range</th><th>Note</th></tr>
<tr><td>Step (binary)</td><td>1 if x ≥ θ else 0</td><td>{0,1}</td><td>Perceptron, MP neuron</td></tr>
<tr><td>Sign (bipolar)</td><td>+1 if x ≥ 0 else −1</td><td>{−1,+1}</td><td>Hebb, Adaline output</td></tr>
<tr><td>Sigmoid</td><td>1/(1+e<sup>−x</sup>)</td><td>(0,1)</td><td>f′ = f(1−f); backprop</td></tr>
<tr><td>tanh</td><td>(e<sup>x</sup>−e<sup>−x</sup>)/(e<sup>x</sup>+e<sup>−x</sup>)</td><td>(−1,1)</td><td>zero-centred; f′ = 1−f²</td></tr>
<tr><td>ReLU</td><td>max(0,x)</td><td>[0,∞)</td><td>deep nets default, less vanishing gradient</td></tr>
<tr><td>Softmax</td><td>e<sup>z<sub>i</sub></sup>/Σe<sup>z<sub>j</sub></sup></td><td>(0,1), sum 1</td><td>multi-class output</td></tr></table>
<p><b>Purpose: NON-LINEARITY.</b> Bina activation ke kitni bhi layers ek linear function hi bante hain.</p>`},
{ h: "4. Learning types & architectures", html: `
<ul><li><b>Supervised</b>: target diya hai (Hebb*, Perceptron, Adaline, Backprop). <b>Unsupervised</b>: target nahi (Competitive, SOM, ART). <b>Reinforcement</b>: sirf reward.</li>
<li>Architectures: single-layer feed-forward, multilayer feed-forward, recurrent (feedback), competitive (lateral connections).</li></ul>`},
{ h: "5. Hebb's learning rule (1949)", fig: "hebb_and", html: `
<p>"Neurons that <b>fire together, wire together</b>." Jo do neurons saath active hon, unka connection strong hota hai.</p>
<div class="formula">w<sub>i</sub>(new) = w<sub>i</sub>(old) + x<sub>i</sub>·t &nbsp;&nbsp; b(new) = b(old) + t</div>
<ul><li><b>Bipolar</b> data use karte hain — binary mein t=0 pe x·t=0, kuch nahi seekhta.</li>
<li>Limitations: error-correction nahi, weights unbounded badh sakte hain, sirf linearly separable simple problems.</li></ul>`},
{ h: "6. Perceptron (Rosenblatt, 1958)", fig: "perceptron_boundary", html: `
<div class="formula">y = 1 if net &gt; θ; 0 if −θ ≤ net ≤ θ; −1 if net &lt; −θ<br>If y ≠ t: w<sub>i</sub> ← w<sub>i</sub> + α t x<sub>i</sub>, &nbsp; b ← b + α t</div>
<ul><li>Sirf <b>galti pe</b> update. Epoch mein koi change nahi → stop.</li>
<li><b>Perceptron Convergence Theorem</b>: data linearly separable ho to finite steps mein converge karega.</li>
<li>Decision boundary w·x + b = 0 (line/hyperplane). <b>XOR solve nahi kar sakta</b> (Minsky & Papert, 1969).</li></ul>`},
{ h: "7. ADALINE & MADALINE (Widrow–Hoff, 1960)", fig: "adaline", html: `
<div class="formula">E = ½ Σ (t − net)² &nbsp;&nbsp; Δw<sub>i</sub> = α (t − net) x<sub>i</sub> &nbsp;&nbsp; Δb = α (t − net)</div>
<p>Delta / LMS rule = squared error pe gradient descent. Error <b>activation se pehle</b> (net pe) measure hota hai. MADALINE = many Adalines in layers.</p>
<table><tr><th>Perceptron</th><th>ADALINE</th></tr>
<tr><td>error = t − y (after step)</td><td>error = t − net (before step)</td></tr>
<tr><td>update only on mistake</td><td>update every sample</td></tr>
<tr><td>oscillates if not separable</td><td>converges to minimum MSE</td></tr>
<tr><td>perceptron rule</td><td>delta / LMS rule (gradient descent)</td></tr></table>`},
{ h: "8. XOR problem & Multilayer feed-forward network", fig: "mlp", html: `
<p>XOR: (0,1),(1,0)→1; (0,0),(1,1)→0. <b>Ek line se alag nahi hota.</b> Solution: hidden layer — h<sub>1</sub> = OR, h<sub>2</sub> = NAND, y = h<sub>1</sub> AND h<sub>2</sub>.</p>
<ul><li>MLP: input → hidden layer(s) → output, fully connected, signals forward only.</li>
<li><b>Universal Approximation Theorem</b>: 1 hidden layer with enough neurons can approximate any continuous function.</li>
<li>Differentiable activation chahiye → backprop se train hota hai.</li></ul>`},
{ h: "9. Back-Propagation algorithm (Rumelhart, Hinton, Williams 1986)", fig: "backprop", html: `
<ol><li>Weights small random initialize.</li><li><b>Forward pass</b>: har layer ka output compute karo.</li>
<li>Error E = ½Σ(t<sub>k</sub> − y<sub>k</sub>)².</li><li><b>Output δ</b>: δ<sub>k</sub> = (t<sub>k</sub> − y<sub>k</sub>)·y<sub>k</sub>(1 − y<sub>k</sub>)</li>
<li><b>Hidden δ</b>: δ<sub>j</sub> = h<sub>j</sub>(1 − h<sub>j</sub>)·Σ<sub>k</sub> δ<sub>k</sub>w<sub>jk</sub></li>
<li><b>Update</b>: w<sub>jk</sub> ← w<sub>jk</sub> + η δ<sub>k</sub> h<sub>j</sub>; &nbsp; v<sub>ij</sub> ← v<sub>ij</sub> + η δ<sub>j</sub> x<sub>i</sub></li>
<li>Repeat for all patterns (epochs) till error small.</li></ol>
<p>Momentum: Δw(t) = η δ x + α Δw(t−1). <span class="analogy">Analogy: match haare to coach blame peeche baant'ta hai — jiska role (weight) bada, uska blame zyada.</span></p>`},
{ h: "10. Convergence issues of MLP", fig: "loss_landscape", html: `
<table><tr><th>Issue</th><th>Remedy</th></tr>
<tr><td>Local minima</td><td>momentum, random restarts, SGD noise</td></tr>
<tr><td>Learning rate: small = slow, large = oscillate/diverge</td><td>tuning, schedules, adaptive (Adam)</td></tr>
<tr><td>Plateaus / saddle points / flat spots</td><td>momentum, adaptive η</td></tr>
<tr><td>Vanishing gradient (sigmoid saturation)</td><td>ReLU, proper init (Xavier/He), batch norm</td></tr>
<tr><td>Overfitting</td><td>early stopping, regularization, more data, dropout</td></tr>
<tr><td>No. of hidden neurons, initialization</td><td>validation, small random weights</td></tr>
<tr><td>Unscaled inputs</td><td>normalization</td></tr></table>`},
{ h: "11. Competitive learning (Winner-Take-All)", fig: "competitive", html: `
<p>Unsupervised. Output neurons compete; <b>winner</b> = min ‖x − w<sub>j</sub>‖. Only winner updates: <b>w<sub>j</sub> ← w<sub>j</sub> + η(x − w<sub>j</sub>)</b>. Lateral inhibition. Result: each neuron = cluster centre (prototype). Examples: MAXNET, Hamming net, Kohonen layer.</p>`},
{ h: "12. Self-Organizing Feature Map (Kohonen SOM)", fig: "som", html: `
<ol><li>Initialize weights randomly; set η(0), neighbourhood radius σ(0).</li>
<li>Pick input x; find BMU c = argmin<sub>j</sub> ‖x − w<sub>j</sub>‖.</li>
<li>Update BMU and neighbours: <b>w<sub>j</sub> ← w<sub>j</sub> + η(t)·h<sub>cj</sub>(t)·(x − w<sub>j</sub>)</b>, h = exp(−d²/2σ²).</li>
<li>Decrease η and σ with time; repeat till convergence.</li></ol>
<p><b>Topology preserving</b>: similar inputs → nearby map units. Phases: ordering + convergence (fine-tuning). Uses: visualization, clustering, speech, document maps.</p>`},
{ h: "13. Adaptive Resonance Theory (ART)", fig: "art", html: `
<p>Grossberg & Carpenter. Solves the <b>stability–plasticity dilemma</b> (learn new without forgetting old).</p>
<ul><li>F1 (comparison) layer, F2 (recognition) layer, reset unit, bottom-up &amp; top-down weights.</li>
<li>Winner F2 category sends top-down <b>expectation</b>; <b>vigilance test</b>: match = |I ∧ W| / |I| ≥ ρ ?</li>
<li>Yes → <b>resonance</b>, learn (W ← I ∧ W). No → <b>reset</b>, try next; none → create <b>new category</b>.</li>
<li>High ρ → many fine categories; low ρ → few broad ones. ART1 binary, ART2 continuous.</li></ul>`},
{ h: "14. Associative memories", fig: "hopfield", html: `
<ul><li>Content-addressable memory: partial/noisy input se poora pattern recall.</li>
<li><b>Auto-associative</b> (x→x): Hopfield. <b>Hetero-associative</b> (x→y): BAM.</li>
<li>Storage (Hebbian): W = Σ x<sup>T</sup>y (outer product). Hopfield: w<sub>ij</sub> = w<sub>ji</sub>, w<sub>ii</sub> = 0.</li>
<li>Recall: s<sub>i</sub> = sign(Σ<sub>j</sub> w<sub>ij</sub>s<sub>j</sub>), asynchronous. Energy E = −½ΣΣ w<sub>ij</sub>s<sub>i</sub>s<sub>j</sub> always decreases → stable state.</li>
<li>Hopfield capacity ≈ 0.15 N patterns. BAM: two layers, recall in both directions using W and W<sup>T</sup>.</li></ul>`},
{ h: "15. Applications", html: `<p>OCR / handwriting (MLP, CNN) · speech recognition · medical diagnosis · fraud detection · forecasting (stock, weather, load) · control & robotics · image compression · clustering &amp; visualization (SOM) · noisy pattern recall (Hopfield).</p>`}
],
short: [
{ q: "Compare biological neuron with artificial neuron. Draw the McCulloch–Pitts model.", a: `Table of mapping (dendrite→input, synapse→weight, soma→Σ, threshold→activation, axon→output) + diagram of neuron with inputs x<sub>1</sub>…x<sub>n</sub>, weights, Σ, f, y. MP neuron: binary inputs, fixed weights, y = 1 if Σw<sub>i</sub>x<sub>i</sub> ≥ θ else 0; no learning. Write example: AND with w=1,1 and θ=2.`, fig: "neuron" },
{ q: "Why is a non-linear activation function needed? Name four activation functions with formula and range.", a: `Without non-linearity, composition of linear layers W<sub>2</sub>(W<sub>1</sub>x) = (W<sub>2</sub>W<sub>1</sub>)x is still linear → cannot learn XOR or complex boundaries. Functions: step, sigmoid 1/(1+e<sup>−x</sup>) (0,1), tanh (−1,1), ReLU max(0,x) [0,∞). Mention sigmoid derivative f(1−f).` },
{ q: "Differentiate between Perceptron and ADALINE.", a: `Use the 4-row table: error after vs before activation; perceptron rule vs delta/LMS rule; update only on mistakes vs every sample; may oscillate vs converges to min MSE. Both single layer and linear boundary.` },
{ q: "State the Perceptron Convergence Theorem. Why can't a single perceptron solve XOR?", a: `If the training set is linearly separable, the perceptron learning rule converges to a separating weight vector in a finite number of steps. XOR points (0,1),(1,0) vs (0,0),(1,1) lie on diagonals; no single line w<sub>1</sub>x<sub>1</sub>+w<sub>2</sub>x<sub>2</sub>+b=0 separates them (contradiction: b≤0, w<sub>1</sub>+b>0, w<sub>2</sub>+b>0 ⇒ w<sub>1</sub>+w<sub>2</sub>+b>0, but (1,1) needs ≤0). Fix: hidden layer (OR, NAND → AND).`, fig: "xor_fig" },
{ q: "Explain the issues regarding convergence of a multilayer perceptron.", a: `Local minima, learning-rate choice, plateaus/saddle points, vanishing gradient, overfitting, initialization, number of hidden units, input scaling — each with remedy (see table in notes).`, fig: "loss_landscape" },
{ q: "What is the stability–plasticity dilemma? How does ART solve it?", a: `Network must be plastic (learn new patterns) yet stable (not forget old). ART uses top-down expectation + vigilance test; only a matching category (match ≥ ρ) is updated (resonance), else reset and new category created — old memories are not overwritten.` },
{ q: "Differentiate auto-associative and hetero-associative memory.", a: `Auto: stores and recalls same pattern (x→x), e.g., Hopfield, used for noise removal/pattern completion. Hetero: associates pairs (x→y), e.g., BAM, recall in both directions. Both use Hebbian outer-product storage W = Σx<sup>T</sup>y.` }
],
long: [
{ q: "Derive / explain the Back-Propagation learning algorithm for a multilayer feed-forward network with one hidden layer. Draw the architecture. State its limitations.", a: `<b>Architecture</b>: input layer x<sub>i</sub>, hidden h<sub>j</sub> (weights v<sub>ij</sub>), output y<sub>k</sub> (weights w<sub>jk</sub>), sigmoid activation.<br>
<b>Forward</b>: net<sub>j</sub> = Σv<sub>ij</sub>x<sub>i</sub>, h<sub>j</sub> = σ(net<sub>j</sub>); net<sub>k</sub> = Σw<sub>jk</sub>h<sub>j</sub>, y<sub>k</sub> = σ(net<sub>k</sub>).<br>
<b>Error</b>: E = ½Σ(t<sub>k</sub> − y<sub>k</sub>)².<br>
<b>Output layer</b> (chain rule): ∂E/∂w<sub>jk</sub> = −(t<sub>k</sub> − y<sub>k</sub>)·y<sub>k</sub>(1−y<sub>k</sub>)·h<sub>j</sub> = −δ<sub>k</sub>h<sub>j</sub> ⇒ Δw<sub>jk</sub> = ηδ<sub>k</sub>h<sub>j</sub>.<br>
<b>Hidden layer</b>: ∂E/∂v<sub>ij</sub> = −[Σ<sub>k</sub>δ<sub>k</sub>w<sub>jk</sub>]·h<sub>j</sub>(1−h<sub>j</sub>)·x<sub>i</sub> ⇒ δ<sub>j</sub> = h<sub>j</sub>(1−h<sub>j</sub>)Σδ<sub>k</sub>w<sub>jk</sub>, Δv<sub>ij</sub> = ηδ<sub>j</sub>x<sub>i</sub>.<br>
<b>Algorithm</b>: init small random → for each pattern forward, compute δ's backward, update → repeat epochs till E &lt; tolerance. Optional momentum term αΔw(t−1).<br>
<b>Limitations</b>: local minima, slow convergence, choice of η and hidden units, vanishing gradient, overfitting, needs differentiable activation.`, fig: "backprop" },
{ q: "Explain Kohonen's Self-Organizing Feature Map: architecture, algorithm, and properties. How is it different from simple competitive learning?", a: `Architecture: input layer fully connected to a 1-D/2-D lattice of output neurons (diagram). Algorithm steps 1–4 from notes with BMU and neighbourhood function h<sub>cj</sub> = exp(−d²/2σ²(t)); η(t), σ(t) decrease. Phases: ordering, convergence. Properties: topology preservation, dimensionality reduction, density matching, unsupervised. <b>Difference</b>: competitive learning updates only the winner; SOM updates winner + neighbours, giving an ordered map.`, fig: "som" },
{ q: "Describe the architecture and working of ART1 network with a neat diagram. What is the role of vigilance parameter?", a: `Components: F1 comparison layer, F2 recognition layer, bottom-up weights (F1→F2), top-down weights (F2→F1), gain control, reset unit. Working: (1) input to F1; (2) F2 neurons compete using bottom-up weights; (3) winner sends top-down expectation; (4) vigilance test |I∧W|/|I| ≥ ρ; (5) resonance → update weights W ← I∧W; else reset winner, search next; (6) if none matches, allocate new category. Vigilance: controls granularity — high ρ fine categories, low ρ coarse. Solves stability–plasticity.`, fig: "art" },
{ q: "Explain Hebb's rule, Perceptron rule and Delta rule with formulas. Train a Hebb net for AND (bipolar).", a: `Hebb: Δw = x·t (no error). Perceptron: Δw = α t x only if y ≠ t. Delta: Δw = α (t − net) x (gradient descent on squared error). Then full Hebb AND table (see Numericals) giving w = (2, 2), b = −2 and verification.`, fig: "hebb_and" }
],
numericals: [
{ q: "Train a Hebb network for AND function with bipolar inputs and targets.", a: `<table><tr><th>x1</th><th>x2</th><th>t</th><th>Δw1</th><th>Δw2</th><th>Δb</th><th>w1</th><th>w2</th><th>b</th></tr>
<tr><td colspan=6>initial</td><td>0</td><td>0</td><td>0</td></tr>
<tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr>
<tr><td>1</td><td>−1</td><td>−1</td><td>−1</td><td>1</td><td>−1</td><td>0</td><td>2</td><td>0</td></tr>
<tr><td>−1</td><td>1</td><td>−1</td><td>1</td><td>−1</td><td>−1</td><td>1</td><td>1</td><td>−1</td></tr>
<tr><td>−1</td><td>−1</td><td>−1</td><td>1</td><td>1</td><td>−1</td><td>2</td><td>2</td><td>−2</td></tr></table>
Boundary 2x<sub>1</sub>+2x<sub>2</sub>−2 = 0. Check: (1,1)→+2 ✓, (1,−1)→−2 ✓, (−1,1)→−2 ✓, (−1,−1)→−6 ✓.` },
{ q: "Train a perceptron for AND (bipolar inputs/targets), α = 1, θ = 0, initial weights and bias 0.", a: `Epoch 1: (1,1,1): net 0 → y 0 ≠ 1 → w=(1,1), b=1. (1,−1,−1): net 1 → y 1 ≠ −1 → w=(0,2), b=0. (−1,1,−1): net 2 → y 1 ≠ −1 → w=(1,1), b=−1. (−1,−1,−1): net −3 → y −1 ✓.<br>Epoch 2: nets 1, −1, −1, −3 → all correct, no change → <b>converged: w=(1,1), b=−1</b>.` },
{ q: "Backprop: 2-2-1 sigmoid network, x = (0.35, 0.9), t = 0.5, v<sub>11</sub>=0.1, v<sub>21</sub>=0.8, v<sub>12</sub>=0.4, v<sub>22</sub>=0.6, w<sub>1</sub>=0.3, w<sub>2</sub>=0.9, η = 1. Do one iteration.", a: `Forward: net<sub>h1</sub>=0.35·0.1+0.9·0.8=0.755 → h<sub>1</sub>=0.680; net<sub>h2</sub>=0.35·0.4+0.9·0.6=0.68 → h<sub>2</sub>=0.664; net<sub>o</sub>=0.680·0.3+0.664·0.9=0.801 → y=0.690. E=½(0.5−0.690)²=0.0181.<br>
δ<sub>o</sub>=(0.5−0.690)(0.690)(0.310)=−0.0407. δ<sub>h1</sub>=0.680·0.320·(−0.0407)·0.3=−0.00265; δ<sub>h2</sub>=0.664·0.336·(−0.0407)·0.9=−0.00817.<br>
w<sub>1</sub>=0.3+(−0.0407)(0.680)=0.2723; w<sub>2</sub>=0.9+(−0.0407)(0.664)=0.8730.<br>
v<sub>11</sub>=0.1+(−0.00265)(0.35)=0.0991; v<sub>21</sub>=0.8+(−0.00265)(0.9)=0.7976; v<sub>12</sub>=0.4+(−0.00817)(0.35)=0.3971; v<sub>22</sub>=0.6+(−0.00817)(0.9)=0.5926.<br>New output y=0.682, E=0.0166 (decreased ✓).` },
{ q: "ADALINE: w=(0.1, 0.1), b=0.1, α=0.1. Apply patterns (1,1,t=1) then (1,−1,t=−1).", a: `P1: net=0.3, e=0.7 → w=(0.17,0.17), b=0.17. P2: net=0.17−0.17+0.17=0.17, e=−1.17 → w=(0.17−0.117, 0.17+0.117)=(0.053, 0.287), b=0.053.` },
{ q: "SOM / competitive: two units w<sub>1</sub>=(0.2,0.6,0.5,0.9), w<sub>2</sub>=(0.8,0.4,0.7,0.3), input x=(1,1,0,0), η=0.5. Find winner and update.", a: `D<sub>1</sub>=(0.8)²+(0.4)²+(0.5)²+(0.9)²=1.86; D<sub>2</sub>=(0.2)²+(0.6)²+(0.7)²+(0.3)²=0.98 → <b>winner unit 2</b>. w<sub>2</sub> ← w<sub>2</sub>+0.5(x−w<sub>2</sub>) = (0.9, 0.7, 0.35, 0.15).` },
{ q: "Hopfield: store p = (1,−1,1,−1). Test with s = (1,1,1,−1).", a: `W = pp<sup>T</sup> − I = [[0,−1,1,−1],[−1,0,−1,1],[1,−1,0,−1],[−1,1,−1,0]]. Ws = (1, −3, 1, −1) → sign → (1,−1,1,−1) = stored pattern ✓ (second bit corrected).` }
]
});
