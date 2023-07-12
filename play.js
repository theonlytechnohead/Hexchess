window.onload = () => {
	board = document.getElementsByTagName("board")[0];
	id = 1;
	for (let i = 1; i < 22; i++) {
		row = document.createElement("row");
		if (i < 6)
			n = i;
		else if (i < 17) {
			if (i % 2)
				n = 5;
			else
				n = 6;
		} else {
			n = 22 - i;
		}
		for (let h = 0; h < n; h++) {
			hex = document.createElement("hex");
			hex.textContent = id;
			id++;
			row.appendChild(hex);
		}
		board.appendChild(row);
	}
};