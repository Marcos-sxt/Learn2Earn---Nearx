#![no_std]

use multiversx_sc::imports::*;

#[multiversx_sc::contract]
pub trait VotacaoContract {
    #[init]
    fn init(&self) {
        self.votos_ethereum().set(&BigUint::zero());
        self.votos_bitcoin().set(&BigUint::zero());
    }

    #[endpoint]
    fn votar_ethereum(&self) {
        let caller = self.blockchain().get_caller();
        require!(!self.ja_votou(&caller).get(), "Você já votou");

        let votos = self.votos_ethereum().get();
        self.votos_ethereum().set(&(votos + 1u32));
        self.ja_votou(&caller).set(true);
    }

    #[endpoint]
    fn votar_bitcoin(&self) {
        let caller = self.blockchain().get_caller();
        require!(!self.ja_votou(&caller).get(), "Você já votou");

        let votos = self.votos_bitcoin().get();
        self.votos_bitcoin().set(&(votos + 1u32));
        self.ja_votou(&caller).set(true);
    }

    #[view]
    fn placar(&self) -> (BigUint<Self::Api>, BigUint<Self::Api>) {
        (
            self.votos_ethereum().get(),
            self.votos_bitcoin().get(),
        )
    }

    #[storage_mapper("votos_ethereum")]
    fn votos_ethereum(&self) -> SingleValueMapper<BigUint<Self::Api>>;

    #[storage_mapper("votos_bitcoin")]
    fn votos_bitcoin(&self) -> SingleValueMapper<BigUint<Self::Api>>;

    #[storage_mapper("ja_votou")]
    fn ja_votou(&self, address: &ManagedAddress) -> SingleValueMapper<bool>;
}
