function Renderer(ctx, scale) { 
	var b2Color			= Box2D.Common.b2Color,
		b2Math			= Box2D.Common.Math.b2Math,
		b2Shape			= Box2D.Collision.Shapes.b2Shape,
		b2PolygonShape 	= Box2D.Collision.Shapes.b2PolygonShape,
		b2CircleShape 	= Box2D.Collision.Shapes.b2CircleShape;

	this.render = function(world, ctx) {
		var color = new b2Color(255, 255, 255);
		var alpha = 1;
		for (var b = world.m_bodyList; b; b = b.m_next) {
			for (var f = b.GetFixtureList(); f; f = f.m_next) {
				this.drawShape(f.GetShape(), b.m_xf, color, alpha);
			}
		}
	}

	this.drawShape = function(shape, xf, color, alpha) {
		switch (shape.m_type) {
		case b2Shape.e_circleShape:
			{
				var circle = ((shape instanceof b2CircleShape ? shape : null));
				var center = b2Math.MulX(xf, circle.m_p);
				var radius = circle.m_radius;
				var axis = xf.R.col1;
				this.drawSolidCircle(center, radius, axis, color, alpha);
			}
			break;
		case b2Shape.e_polygonShape:
			{
				var i = 0;
				var poly = ((shape instanceof b2PolygonShape ? shape : null));
				var vertexCount = parseInt(poly.GetVertexCount());
				var localVertices = poly.GetVertices();
				var vertices = new Vector(vertexCount);
	            for (i = 0; i < vertexCount; ++i) {
					vertices[i] = b2Math.MulX(xf, localVertices[i]);
				}
				this.drawSolidPolygon(vertices, vertexCount, color, alpha);
			}
			break;
		case b2Shape.e_edgeShape:
			{
				console.log("trying to draw a segment!");
//				var edge = (shape instanceof b2EdgeShape ? shape : null);
//				this.m_debugDraw.DrawSegment(b2Math.MulX(xf, edge.GetVertex1()), b2Math.MulX(xf, edge.GetVertex2()), color);
			}
			break;
		}
	}

	this.drawSolidCircle = function(center, radius, axis, color, alpha) {
		if(!radius) return;
		var s = ctx,
			cx = center.x * scale,
			cy = center.y * scale;
		s.moveTo(0, 0);
		s.beginPath();
		s.strokeStyle = this.toRGBA(color.color, alpha);
		s.fillStyle = this.toRGBA(color.color, alpha);
		s.arc(cx, cy, radius * scale, 0, Math.PI*2, true);
		s.moveTo(cx, cy);
		s.lineTo((center.x + axis.x * radius) * scale, (center.y + axis.y * radius) * scale);
		s.closePath();
		s.fill();
		s.stroke();
	};

	this.drawSolidPolygon = function(vertices, vertexCount, color, alpha) {
		if(!vertexCount) return;
		var s = ctx;
		s.beginPath();
		s.strokeStyle = this.toRGBA(color.color, alpha);
		s.fillStyle = this.toRGBA(color.color, alpha);
		s.moveTo(vertices[0].x * scale, vertices[0].y * scale);
		for (var i = 1; i < vertexCount; i++) {
		   s.lineTo(vertices[i].x * scale, vertices[i].y * scale);
		}
		s.lineTo(vertices[0].x * scale, vertices[0].y * scale);
		s.closePath();
		s.fill();
		s.stroke();
	};
	
	this.toRGBA = function(color, alpha) {
		return "rgba(" + ((color & 0xFF0000) >> 16) + "," + ((color & 0xFF00) >> 8) + "," + (color & 0xFF) + "," + alpha + ")";
	};	
};