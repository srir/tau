signature SERIALIZABLE =
sig
    type t
    val write : t -> string
    val read : string -> (t * string) option
    (* invariant: read (write v ^ s) ==> SOME (v , s) *)
end
