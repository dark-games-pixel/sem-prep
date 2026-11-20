window.MODS = window.MODS || [];
MODS.push({
id: "m3", num: 3, title: "Introduction to Deep Learning: Bayesian Learning, Decision Surfaces, Linear Classifiers, Hinge Loss", lectures: "4L", time: "1 h",
videos: ["p07"],
widgets: ["bayes", "hinge"],
why: "Small module, easy marks: Bayes numerical, hinge-loss formula/example, linear machine diagram.",
notes: [
{ h: "1. Bayes theorem", html: `
<div class="formula">P(ω<sub>i</sub>|x) = P(x|ω<sub>i</sub>) P(ω<sub>i</sub>) / P(x), &nbsp;&nbsp; P(x) = Σ<sub>j</sub> P(x|ω<sub>j</sub>) P(ω<sub>j</sub>)</div>
<p><b>Posterior = Likelihood × Prior / Evidence.</b> Bayes decision rule: choose ω<sub>i</sub> with maximum posterior → minimizes probability of error (optimal classifier). Equivalent: decide ω<sub>1</sub> if P(x|ω<sub>1</sub>)P(ω<sub>1</sub>) &gt; P(x|ω<sub>2</sub>)P(ω<sub>2</sub>), i.e., likelihood ratio &gt; P(ω<sub>2</sub>)/P(ω<sub>1</sub>).</p>
<p class="analogy">Analogy: 1% logon ko bimari, test 99% accurate → positive aane pe bhi sirf 50% chance bimari ka (prior matter karta hai).</p>`},
{ h: "2. Bayesian learning: ML, MAP, Naive Bayes", fig: "bayes", html: `
<ul><li><b>MAP</b>: h<sub>MAP</sub> = argmax<sub>h</sub> P(D|h) P(h).</li>
<li><b>ML</b>: h<sub>ML</sub> = argmax<sub>h</sub> P(D|h) (when priors equal). Minimizing MSE = ML under Gaussian noise.</li>
<li><b>Naive Bayes</b>: features conditionally independent: P(x|ω) = Π<sub>j</sub> P(x<sub>j</sub>|ω). Simple, fast, works for spam/text.</li>
<li>Bayes error = overlap of class-conditional densities; minimum achievable error.</li>
<li>Bayesian view of NN: prior on weights; Gaussian prior ⇒ L2 regularization (weight decay).</li>
<li>Bayes risk with loss λ(α<sub>i</sub>|ω<sub>j</sub>): R(α<sub>i</sub>|x) = Σ<sub>j</sub> λ<sub>ij</sub> P(ω<sub>j</sub>|x); choose action with minimum risk.</li></ul>`},
{ h: "3. Decision surfaces", fig: "decision_surface", html: `
<ul><li>Classifier partitions feature space into decision regions R<sub>1</sub>, R<sub>2</sub>, …</li>
<li>Decision boundary/surface: g<sub>i</sub>(x) = g<sub>j</sub>(x).</li>
<li>Linear boundary: line (2-D), plane (3-D), hyperplane (n-D). For Gaussian classes with equal covariance → linear; unequal covariance → quadratic surfaces.</li>
<li>MLP / kernels produce non-linear surfaces.</li></ul>`},
{ h: "4. Linear classifiers & discriminant functions", html: `
<div class="formula">g(x) = w<sup>T</sup>x + w<sub>0</sub> &nbsp;&nbsp; decide ω<sub>1</sub> if g(x) &gt; 0 else ω<sub>2</sub></div>
<ul><li>w is normal to the hyperplane; signed distance r = g(x)/‖w‖; distance of origin = w<sub>0</sub>/‖w‖.</li>
<li>Examples: Perceptron, ADALINE, Logistic regression, Linear SVM, Fisher LDA.</li>
<li>Augmented vectors: y = [1, x], a = [w<sub>0</sub>, w] ⇒ g = a<sup>T</sup>y.</li></ul>`},
{ h: "5. Linear machine (multi-class)", fig: "linear_machine", html: `
<p>c discriminants g<sub>i</sub>(x) = w<sub>i</sub><sup>T</sup>x + w<sub>i0</sub>; assign x to class with largest g<sub>i</sub>. Boundary between i and j: (w<sub>i</sub> − w<sub>j</sub>)<sup>T</sup>x + (w<sub>i0</sub> − w<sub>j0</sub>) = 0. Regions are <b>convex</b> and singly connected. Avoids ambiguous regions of one-vs-rest.</p>`},
{ h: "6. Linear machines with hinge loss", fig: "hinge", html: `
<div class="formula">L(y, f(x)) = max(0, 1 − y·f(x)), &nbsp; y ∈ {−1, +1}</div>
<ul><li>Zero loss only if correct <b>and</b> margin ≥ 1; inside margin → small loss; wrong side → loss grows linearly.</li>
<li>Soft-margin SVM: min ½‖w‖² + C Σ max(0, 1 − y<sub>i</sub>(w<sup>T</sup>x<sub>i</sub> + b)).</li>
<li>Sub-gradient: if y·f &lt; 1: ∂L/∂w = −y x, else 0 → update w ← w + η y x (plus regularization).</li>
<li>Multi-class (Weston–Watkins / CS231n SVM loss): L = Σ<sub>j≠y</sub> max(0, f<sub>j</sub> − f<sub>y</sub> + 1).</li>
<li>Convex upper bound on 0-1 loss; compare with logistic loss log(1+e<sup>−yf</sup>).</li></ul>`, fig2: "svm_margin" },
{ h: "7. Max-margin idea", html: `<p>Margin width = 2/‖w‖ ⇒ maximize margin ⇔ minimize ‖w‖². Points on margin lines = <b>support vectors</b>. C large → fewer training errors, narrow margin; C small → wider margin, more tolerance.</p>`}
],
short: [
{ q: "State Bayes theorem and Bayes decision rule. Why is it called optimal?", a: `Formula + rule. It minimizes probability of error since for each x it picks the class with the highest posterior; P(error|x) = 1 − max<sub>i</sub>P(ω<sub>i</sub>|x) is minimum pointwise, hence over all x.` },
{ q: "Differentiate ML and MAP estimation.", a: `ML maximizes P(D|θ) only; MAP maximizes P(D|θ)P(θ) including prior. MAP → ML when prior uniform. MAP with Gaussian prior = L2 regularization.` },
{ q: "What is a decision surface? Explain with two-class and multi-class examples.", a: `See notes 3 & 5; give g(x)=0 hyperplane and linear machine regions.`, fig: "decision_surface" },
{ q: "Define hinge loss. Compute it for (y=+1, f=0.3), (y=−1, f=0.5), (y=+1, f=2).", a: `max(0,1−yf): 0.7, 1.5, 0.`, fig: "hinge" },
{ q: "What is a linear machine? Show that its decision regions are convex.", a: `If x<sub>a</sub>, x<sub>b</sub> ∈ R<sub>i</sub> then g<sub>i</sub> ≥ g<sub>j</sub> at both; since g linear, at λx<sub>a</sub> + (1−λ)x<sub>b</sub> the inequality holds by linearity ⇒ point in R<sub>i</sub> ⇒ convex.` }
],
long: [
{ q: "Explain Bayesian learning and Bayes decision theory for classification. Discuss minimum error rate classification, ML, MAP and Naive Bayes with an example.", a: `Bayes theorem, posterior, decision rule, probability of error, risk with loss matrix, likelihood ratio test; ML vs MAP; Naive Bayes assumption with spam example; 1D two-Gaussian figure showing boundary and Bayes error; numerical (disease test).`, fig: "bayes" },
{ q: "Explain linear classifiers and linear machines. Derive the update for a linear machine with hinge loss. How does it relate to SVM?", a: `g(x)=w<sup>T</sup>x+w<sub>0</sub>, geometry (normal, distance), multi-class linear machine with max rule, boundaries. Hinge loss objective J = ½λ‖w‖² + Σmax(0,1−y<sub>i</sub>f(x<sub>i</sub>)); sub-gradient: for violating samples w ← w − η(λw − y<sub>i</sub>x<sub>i</sub>), else w ← w − ηλw. Margin 2/‖w‖, support vectors, soft margin C ⇒ linear SVM. Compare with perceptron (perceptron loss max(0,−yf)).`, fig: "svm_margin" }
],
numericals: [
{ q: "Disease affects 1% of population. Test detects disease 99% of time and gives 1% false positives. A person tests positive. P(disease)?", a: `P(+) = 0.99·0.01 + 0.01·0.99 = 0.0198. P(D|+) = 0.0099/0.0198 = <b>0.5</b>.` },
{ q: "Two classes with P(ω<sub>1</sub>)=0.6, P(ω<sub>2</sub>)=0.4. For a feature x, P(x|ω<sub>1</sub>)=0.2, P(x|ω<sub>2</sub>)=0.5. Classify x.", a: `Unnormalized: 0.6·0.2 = 0.12; 0.4·0.5 = 0.20. P(x) = 0.32. Posteriors 0.375 and 0.625 → <b>ω<sub>2</sub></b>.` },
{ q: "Hinge loss update: w = (0.5, −0.5), b = 0, x = (1, 2), y = +1, η = 0.1 (ignore regularization).", a: `f = 0.5 − 1.0 = −0.5; L = max(0, 1 + 0.5) = 1.5 &gt; 0 ⇒ w ← w + η y x = (0.6, −0.3); b ← 0.1. New f = 0.6 − 0.6 + 0.1 = 0.1 (moving towards correct side).` },
{ q: "Distance of point (3,4) from line 3x<sub>1</sub> + 4x<sub>2</sub> − 5 = 0.", a: `g = 9 + 16 − 5 = 20; ‖w‖ = 5; r = 20/5 = 4.` }
]
});
