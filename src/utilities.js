export const drawRect = (detections, ctx) => {
    detections.forEach(prediction => {
        const [x, y, width, height] = prediction['bbox'];
        const text = prediction['class'];
        const [x_center, y_center] = [(x + width) / 2, (y + height) / 2];
        const color = 'green';

        // Draw the rectangle first
        ctx.strokeStyle = color; // sets outline color of bounding box
        ctx.font = '18px Arial'; // sets font style
        ctx.fillStyle = color; // sets fill color of text

        ctx.beginPath(); // begins the drawing
        ctx.fillText(text, x, y); // fill text/label at the top left corner
        ctx.rect(x, y, width, height); // defines a rectangle
        ctx.stroke(); // draws the outline of the rectangle

        // Draw a point at the center after drawing the rectangle
        ctx.beginPath();
        ctx.arc(x_center, y_center, 3, 0, 2 * Math.PI);
        ctx.fillStyle = 'red'; // Change the color if needed
        ctx.fill();
    });
};
