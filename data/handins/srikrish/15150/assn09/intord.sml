structure IntOrder : ORDERED =
struct
  type t = int

  val compare : t * t -> order = Int.compare
end
