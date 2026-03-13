const FoodCard = ({ food, onAdd }) => {
  const imageSrc = Array.isArray(food.image) ? food.image[0] : food.image;
  return (
    <div className="card bg-base-100 shadow-md">
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={food.name}
          className="h-40 w-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{food.name}</h2>
        <p className="text-sm text-base-content/70">{food.description}</p>
        <div className="card-actions justify-between items-center mt-2">
          <span className="font-semibold">${food.price.toFixed(2)}</span>
          {onAdd && (
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={() => onAdd(food)}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;

