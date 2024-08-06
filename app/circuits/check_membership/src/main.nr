
fn main(message : [Field; 62], index : Field, hashpath : [Field; 40], root : Field) {
    let leaf = std::hash::hash_to_field(message.as_slice());
    let merkle_root = std::merkle::compute_merkle_root(leaf, index, hashpath);
    assert(merkle_root == root);
}

#[test]
fn test_main() {
    main(1, 2);

    // Uncomment to make test fail
    // main(1, 1);
}
